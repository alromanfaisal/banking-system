package handlers

import (
	"context"
	"errors"
	"log"
	"net/http"

	"banking_backend/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type SecureTransferReq struct {
	ToAccountID int64   `json:"to_account_id" binding:"required"`
	Amount      float64 `json:"amount" binding:"required,gt=0"`
}

// TransferFund processes atomic fund transfer using authenticated user's context
func TransferFund(c *gin.Context) {
	var req SecureTransferReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Step 1: Extract authenticated userID set by AuthMiddleware
	val, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized user"})
		return
	}
	authUserID := val.(int64)

	ctx := context.Background()

	// Step 2: Start PostgreSQL Database Transaction
	tx, err := db.DB.Begin(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start transaction"})
		return
	}
	defer tx.Rollback(ctx)

	// Step 3: Fetch the sender's account ID using their authenticated user_id
	var fromAccountID int64
	var fromBalance float64
	err = tx.QueryRow(ctx, 
		`SELECT id, balance FROM accounts WHERE user_id = $1 FOR UPDATE`, 
		authUserID,
	).Scan(&fromAccountID, &fromBalance)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "sender account not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to lock sender account"})
		return
	}

	// Step 4: Prevent transferring to self
	if fromAccountID == req.ToAccountID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot transfer money to your own account"})
		return
	}

	// Step 5: Check sufficient balance
	if fromBalance < req.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "insufficient funds"})
		return
	}

	// Step 6: Lock receiver account and verify existence
	var toBalance float64
	err = tx.QueryRow(ctx, 
		`SELECT balance FROM accounts WHERE id = $1 FOR UPDATE`, 
		req.ToAccountID,
	).Scan(&toBalance)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "recipient account not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to lock recipient account"})
		return
	}

	// Step 7: Update balances atomically
	_, err = tx.Exec(ctx, `UPDATE accounts SET balance = balance - $1 WHERE id = $2`, req.Amount, fromAccountID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to deduct funds"})
		return
	}

	_, err = tx.Exec(ctx, `UPDATE accounts SET balance = balance + $1 WHERE id = $2`, req.Amount, req.ToAccountID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to credit funds"})
		return
	}

	// Step 8: Create audit transaction record
	_, err = tx.Exec(ctx, 
		`INSERT INTO transactions (from_account_id, to_account_id, amount, type) VALUES ($1, $2, $3, 'TRANSFER')`,
		fromAccountID, req.ToAccountID, req.Amount,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to record transaction"})
		return
	}

	// Step 9: Commit Transaction
	if err := tx.Commit(ctx); err != nil {
		log.Println("Commit Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transfer successful!",
		"from":    fromAccountID,
		"to":      req.ToAccountID,
		"amount":  req.Amount,
	})
}