// banking_backend/handlers/transfer.go
package handlers

import (
	"errors"
	"net/http"

	"banking_backend/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type TransferRequest struct {
	ToAccountID int64   `json:"to_account_id" binding:"required,gt=0"`
	Amount      float64 `json:"amount" binding:"required,gt=0"`
}

func TransferMoney(c *gin.Context) {
	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized access"})
		return
	}
	userID := userIDVal.(int64)

	var req TransferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := c.Request.Context()

	// Get sender's account ID
	var fromAccountID int64
	err := db.DB.QueryRow(
		ctx,
		"SELECT id FROM accounts WHERE user_id = $1",
		userID,
	).Scan(&fromAccountID)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "sender account not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	if fromAccountID == req.ToAccountID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot transfer money to your own account"})
		return
	}

	tx, err := db.DB.Begin(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start transaction"})
		return
	}
	defer tx.Rollback(ctx)

	// Prevent Deadlocks: Lock accounts in deterministic ID order
	firstLockID, secondLockID := fromAccountID, req.ToAccountID
	if firstLockID > secondLockID {
		firstLockID, secondLockID = secondLockID, firstLockID
	}

	var dummy float64
	err = tx.QueryRow(ctx, "SELECT balance FROM accounts WHERE id = $1 FOR UPDATE", firstLockID).Scan(&dummy)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "account not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to lock account"})
		return
	}

	err = tx.QueryRow(ctx, "SELECT balance FROM accounts WHERE id = $1 FOR UPDATE", secondLockID).Scan(&dummy)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "recipient account not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to lock recipient account"})
		return
	}

	// Verify balance
	var senderBalance float64
	err = tx.QueryRow(ctx, "SELECT balance FROM accounts WHERE id = $1", fromAccountID).Scan(&senderBalance)
	if err != nil || senderBalance < req.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "insufficient funds"})
		return
	}

	// Deduct and Credit
	_, err = tx.Exec(ctx, "UPDATE accounts SET balance = balance - $1 WHERE id = $2", req.Amount, fromAccountID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to deduct balance"})
		return
	}

	_, err = tx.Exec(ctx, "UPDATE accounts SET balance = balance + $1 WHERE id = $2", req.Amount, req.ToAccountID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to credit balance"})
		return
	}

	// Record audit
	_, err = tx.Exec(
		ctx,
		"INSERT INTO transactions (from_account_id, to_account_id, amount, type) VALUES ($1, $2, $3, $4)",
		fromAccountID, req.ToAccountID, req.Amount, "TRANSFER",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to record transaction"})
		return
	}

	if err := tx.Commit(ctx); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "transfer successful",
		"amount":  req.Amount,
	})
}