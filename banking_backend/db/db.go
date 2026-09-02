package db

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func InitDB() {
	connStr := "postgres://postgres:root@localhost:5432/banking_db?sslmode=disable"

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatalf("Config error: %v", err)
	}

	config.MaxConns = 10
	config.MinConns = 2

	DB, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to connect to DB: %v", err)
	}

	if err := DB.Ping(context.Background()); err != nil {
		log.Fatalf("DB Ping failed: %v", err)
	}

	fmt.Println("🚀 Connected to PostgreSQL successfully!")
}