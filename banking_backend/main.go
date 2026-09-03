// banking_backend/main.go

package main

import (
	"log"

	"banking_backend/db"
	"banking_backend/handlers"
	"banking_backend/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDB()

	r := gin.Default()

	// 🔐 CORS Middleware যুক্ত করা হলো
	r.Use(middleware.CORSMiddleware())

	// Public Routes
	r.POST("/api/register", handlers.Register)
	r.POST("/api/login", handlers.Login)

	// Protected Routes (JWT Required)
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/me", handlers.GetProfile)
		protected.POST("/transfer", handlers.TransferMoney)
		protected.GET("/transactions", handlers.GetTransactionHistory)
	}

	log.Println("🚀 Server running on port 8080...")
	r.Run(":8080")
}