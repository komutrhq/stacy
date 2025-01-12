package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"stacy/api"
	"stacy/config"
	"stacy/cron"
	"stacy/frontend"
	"stacy/worker"
)

func main() {
	cfg := config.ValidateConfig()

	// Capture signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	if cfg.WithAPI {
		go api.Run()
	}

	if cfg.WithFrontend {
		go frontend.Run()
	}

	if cfg.WithWorker {
		go worker.Run()
		go cron.Run()
	}

	log.Println("Stacy started. Press CTRL+C to exit.")
	<-sigChan
	log.Println("Termination signal received. Exiting.")
}
