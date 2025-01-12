package frontend

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"stacy/config"
)

func Run() {
	cfg := config.LoadConfig()

	// Listen for signals
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt, syscall.SIGTERM)

	if cfg.Env == "development" {
		cmd := exec.Command("pnpm", "dev", fmt.Sprintf("--port=%d", cfg.FrontendPort))
		cmd.Dir = "./frontend"
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Start(); err != nil {
			panic(err)
		}

		go func() {
			<-signals
			if cmd.Process != nil {
				log.Println("Stopping dev command...")
				cmd.Process.Kill()
			}
		}()

		fmt.Printf("Frontend server started on http://localhost:%d\n", cfg.FrontendPort)

		if err := cmd.Wait(); err != nil {
			log.Printf("dev command exited with error: %v", err)
		}
	} else if cfg.Env == "production" {
		// Check if dist folder exists
		if _, err := os.Stat("./frontend/dist"); os.IsNotExist(err) {
			log.Panic("frontend/dist folder does not exist. Run `pnpm build` first")
		}

		router := gin.Default()
		router.Use(static.Serve("/", static.LocalFile("./frontend/dist", true)))

		api := router.Group("/api")
		{
			api.GET("/", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{
					"message": "pong",
				})
			})
		}

		server := &http.Server{
			Addr:    fmt.Sprintf(":%d", cfg.FrontendPort),
			Handler: router,
		}

		go func() {
			<-signals
			log.Println("Stopping production server...")
			server.Shutdown(context.Background())
		}()

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("production server exited with error: %v", err)
		}
	}
}
