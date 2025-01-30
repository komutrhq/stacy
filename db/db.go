package db

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"stacy/config"
)

type DB struct {
	Px *gorm.DB
	Rx *redis.Client
}

func New(cfg *config.Config) DB {
	// Check Redis connection. Do simple ping-pong test
	redisClient := redis.NewClient(&redis.Options{
		Addr: cfg.RedisAddr,
	})
	defer redisClient.Close()

	if _, err := redisClient.Ping(context.Background()).Result(); err != nil {
		log.Fatalf("could not connect to Redis (%s): %v", cfg.RedisAddr, err)
	}
	log.Printf("Successfully connected to Redis (%s)", cfg.RedisAddr)

	// Check Postgres connection
	postgresClient, err := gorm.Open(postgres.Open(cfg.PostgresDSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("could not connect to Postgres: %v", err)
	}

	log.Printf("Successfully connected to Postgres")

	// Get the underlying sql.DB object
	sqlDB, err := postgresClient.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}

	// Check database connectivity using Ping()
	err = sqlDB.Ping()
	if err != nil {
		log.Fatal("Database is NOT reachable:", err)
	}

	log.Println("Database is reachable")

	return DB{Px: postgresClient, Rx: redisClient}
}
