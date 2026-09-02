package handlers

import (
	"context"
	"errors"
	"net/http"
	"time"

	"banking_backend/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type UserProfileResp struct {
	ID            int64     `json:"id"`
	FullName      string    `json:"full_name"`
	Email         string    `json:"email"`
	AccountID     int64     `json:"account_id"`
	AccountNumber string    `json:"account_number"`
	Balance       float64   `json:"balance"`
	Currency      string    `json:"currency"`
	CreatedAt     time.Time `json:"created_at"`
}

type TransactionRecord struct {
	ID              int64     `json:"id"`
	FromAccountID   int64     `json:"from_account_id"`
	ToAccountID     int64     `json:"to_account_id"`
	Amount          float64   `json:"amount"`
	Type            string    `json:"type"`
	CreatedAt       time.Time `json:"created_at"`
}

// GetProfile retrieves logged-in user details, account info, and live balance
func GetProfile(c *gin.Context) {
	val, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized user"})
		return
	}
	userID := val.(int64)

	ctx := context.Background()
	var profile UserProfileResp

	query := `
		SELECT 
			u.id, u.full_name, u.email, u.created_at,
			a.id AS account_id, a.account_number, a.balance, a.currency
		FROM users u
		JOIN accounts a ON u.id = a.user_id
		WHERE u.id = $1
	`

	err := db.DB.QueryRow(ctx, query, userID).Scan(
		&profile.ID,
		&profile.FullName,
		&profile.Email,
		&profile.CreatedAt,
		&profile.AccountID,
		&profile.AccountNumber,
		&profile.Balance,
		&profile.Currency,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user profile or account not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch profile"})
		return
	}

	c.JSON(http.StatusOK, profile)
}

// GetTransactionHistory retrieves recent transfers involving the authenticated user's account
func GetTransactionHistory(c *gin.Context) {
	val, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized user"})
		return
	}
	userID := val.(int64)

	ctx := context.Background()

	// Fetch user's account ID
	var accountID int64
	err := db.DB.QueryRow(ctx, `SELECT id FROM accounts WHERE user_id = $1`, userID).Scan(&accountID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "account not found"})
		return
	}

	// Retrieve transactions where account is either sender or receiver
	query := `
		SELECT id, from_account_id, to_account_id, amount, type, created_at
		FROM transactions
		WHERE from_account_id = $1 OR to_account_id = $1
		ORDER BY created_at DESC
		LIMIT 20
	`

	rows, err := db.DB.Query(ctx, query, accountID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch transactions"})
		return
	}
	defer rows.Close()

	var transactions []TransactionRecord = []TransactionRecord{}
	for rows.Next() {
		var txRecord TransactionRecord
		if err := rows.Scan(
			&txRecord.ID,
			&txRecord.FromAccountID,
			&txRecord.ToAccountID,
			&txRecord.Amount,
			&txRecord.Type,
			&txRecord.CreatedAt,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse transaction records"})
			return
		}
		transactions = append(transactions, txRecord)
	}

	c.JSON(http.StatusOK, gin.H{
		"account_id":    accountID,
		"total_records": len(transactions),
		"transactions":  transactions,
	})
}
