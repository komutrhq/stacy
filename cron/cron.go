package cron

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"stacy/config"
	"stacy/db"
)

func Run(cfg *config.Config, db *db.DB) {

	// Listen for signals
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt, syscall.SIGTERM)

	var done = false

	go func() {
		sig := <-signals
		log.Printf("Received signal: %v. Shutting down.", sig)
		done = true
	}()

	for !done {

		time.Sleep(time.Duration(cfg.HeartbeatInterval) * time.Second)
		fmt.Printf("Cron: %s\n", time.Now().Format("15:04:05"))
		// TODO: Enqueue cron scheduler task here
	}
}
