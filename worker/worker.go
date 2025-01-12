package worker

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/hibiken/asynq"

	"stacy/config"
	"stacy/tasks"
)

func Run() {
	cfg := config.LoadConfig()

	// Listen for signals
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt, syscall.SIGTERM)

	// Initialize Asynq server
	server := asynq.NewServer(
		asynq.RedisClientOpt{Addr: cfg.RedisAddr},
		asynq.Config{
			Concurrency: cfg.WorkerConcurrency,
		},
	)

	// Register task handlers
	mux := asynq.NewServeMux()
	mux.HandleFunc(tasks.TaskSendRequest, tasks.HandleRequestSenderTask)
	mux.HandleFunc(tasks.TaskCron, tasks.HandleCronTask)

	// Signal handler goroutine
	go func() {
		sig := <-signals
		log.Printf("Received signal: %v. Shutting down.", sig)
		server.Shutdown()
	}()

	// Start Asynq server
	log.Println("Starting runner server...")
	if err := server.Run(mux); err != nil {
		log.Fatalf("Could not start runner server: %v", err)
	}
}
