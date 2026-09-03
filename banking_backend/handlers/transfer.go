// banking_backend/handlers/transfer.go

package handlers

import (
	"context"
	"net/http"

	"banking_backend/db"
	"banking_backend/models"

	"github.com/gin-gonic/generic" // যদি আপনার জিনি প্রয়োজন হয়, সাধারণ gin.Context ব্যবহার করুন
	"github.com/gin-gonic/gin"
)

type TransferRequest struct {
	ToAccountID int64   `json:"to_account_id" binding:"required"`
	Amount      float64 `json:"amount" binding:"required"`
}

func TransferMoney(c *gin.Context) {
	// ১. টোকেন বা কনটেক্সট থেকে ইউজার আইডি সংগ্রহ
	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized access"})
		return
	}
	userID := userIDVal.(int64)

	var req TransferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	// -------------------------------------------------------------
	// 🔐 INPUT VALIDATIONS & SECURITY CHECKS
	// -------------------------------------------------------------

	// ১. অ্যামাউন্ট ভ্যালিডেশন (০ বা তার কম টাকা ট্রান্সফার করা যাবে না)
	if req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "transfer amount must be greater than zero"})
		return
	}

	// ২. প্রেরকের অ্যাকাউন্ট আইডি বের করা
	var fromAccountID int64
	err := db.DB.QueryRow(
		context.Background(),
		"SELECT id FROM accounts WHERE user_id = $1",
		userID,
	).Scan(&fromAccountID)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "sender account not found"})
		return
	}

	// ৩. সেলফ-ট্রান্সফার ভ্যালিডেশন (নিজের অ্যাকাউন্টে নিজে টাকা পাঠানো ব্লক করা)
	if fromAccountID == req.ToAccountID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot transfer money to your own account"})
		return
	}

	// -------------------------------------------------------------
	// 🏦 ATOMIC DATABASE TRANSACTION (BEGIN ... COMMIT)
	// -------------------------------------------------------------

	ctx := context.Background()
	tx, err := db.DB.Begin(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start transaction"})
		return
	}
	defer tx.Rollback(ctx)

	// ৪. প্রেরকের ব্যালেন্স লক এবং চেক করা (FOR UPDATE)
	var senderBalance float64
	err = tx.QueryRow(
		ctx,
		"SELECT balance FROM accounts WHERE id = $1 FOR UPDATE",
		fromAccountID,
	).Scan(&senderBalance)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to lock sender account"})
		return
	}

	if senderBalance < req.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "insufficient funds"})
		return
	}

	// ৫. প্রাপকের অ্যাকাউন্ট অস্তিত্ব চেক করা
	var recipientBalance float64
	err = tx.QueryRow(
		ctx,
		"SELECT balance FROM accounts WHERE id = $1 FOR UPDATE",
		req.ToAccountID,
	).Scan(&recipientBalance)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "recipient account not found"})
		return
	}

	// ৬. প্রেরকের অ্যাকাউন্ট থেকে টাকা বিয়োগ করা
	_, err = tx.Exec(
		ctx,
		"UPDATE accounts SET balance = balance - $1 WHERE id = $2",
		req.Amount,
		fromAccountID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to deduct balance"})
		return
	}

	// ৭. প্রাপকের অ্যাকাউন্টে টাকা যোগ করা
	_, err = tx.Exec(
		ctx,
		"UPDATE accounts SET balance = balance + $1 WHERE id = $2",
		req.Amount,
		req.ToAccountID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to credit balance"})
		return
	}

	// ৮. ট্রানজেকশন লেজারে তথ্য সংরক্ষণ
	_, err = tx.Exec(
		ctx,
		"INSERT INTO transactions (from_account_id, to_account_id, amount, type) VALUES ($1, $2, $3, $4)",
		fromAccountID,
		req.ToAccountID,
		req.Amount,
		"TRANSFER",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to record transaction"})
		return
	}

	// ৯. ট্রানজেকশন নিশ্চিতকরণ (Commit)
	if err := tx.Commit(ctx); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "transfer successful",
		"amount":  req.Amount,
	})
}