package handlers

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"

	"banking_backend/db"
	"banking_backend/utils"

	"github.com/gin-gonic/gin"
)

type RegisterReq struct {
	FullName string `json:"full_name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register handles user signup and automatically opens an account with initial bonus
func Register(c *gin.Context) {
	var req RegisterReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPass, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	ctx := context.Background()
	tx, err := db.DB.Begin(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start transaction"})
		return
	}
	defer tx.Rollback(ctx)

	// Step 1: Insert new user into database
	var userID int64
	err = tx.QueryRow(ctx,
		`INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
		req.FullName, req.Email, hashedPass,
	).Scan(&userID)

	if err != nil {
		log.Println("Error inserting user:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "email already exists or invalid data"})
		return
	}

	// Step 2: Generate random account number and create bank account (1000 BDT initial bonus)
	accNum := fmt.Sprintf("ACC-%d", rand.Intn(899999)+100000)
	_, err = tx.Exec(ctx,
		`INSERT INTO accounts (user_id, account_number, balance, currency) VALUES ($1, $2, $3, 'BDT')`,
		userID, accNum, 1000.00,
	)

	if err != nil {
		log.Println("Error creating account:", err) // Prints actual DB error in terminal
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create bank account"})
		return
	}

	if err := tx.Commit(ctx); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":        "User registered successfully!",
		"account_number": accNum,
		"initial_bonus":  1000.00,
	})
}

// Login verifies credentials and generates a signed JWT token
func Login(c *gin.Context) {
	var req LoginReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	var userID int64
	var passwordHash string

	err := db.DB.QueryRow(ctx,
		`SELECT id, password_hash FROM users WHERE email = $1`, req.Email,
	).Scan(&userID, &passwordHash)

	if err != nil || !utils.CheckPasswordHash(req.Password, passwordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	token, err := utils.GenerateToken(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful!",
		"token":   token,
	})
}
