package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"stacy/api"
	"stacy/config"
	"stacy/cron"
	"stacy/db"
	"stacy/frontend"
	"stacy/worker"
)

func main() {
	cfg := config.New()

	// Initialize database clients
	db := db.New(&cfg)

	// Capture signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	if cfg.WithAPI {
		go api.Run(&cfg, &db)
	}

	if cfg.WithFrontend {
		go frontend.Run(&cfg)
	}

	if cfg.WithWorker {
		go worker.Run(&cfg, &db)
		go cron.Run(&cfg, &db)
	}

	log.Println("Stacy started. Press CTRL+C to exit.")
	<-sigChan
	log.Println("Termination signal received. Exiting.")
}
