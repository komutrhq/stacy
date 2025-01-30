package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	_ "github.com/joho/godotenv/autoload"
)

type Config struct {
	RedisAddr      string `validate:"required"`
	RedisPassword  string
	PostgresDSN    string `validate:"required"`
	WithFrontend   bool   `validate:"required"`
	WithAPI        bool   `validate:"required"`
	WithWorker     bool   `validate:"required"`
	Env            string `validate:"required"`
	Mode           string `validate:"required,oneof=monolith backend frontend-only api-only worker-only"`
	AllowGoogleSSO bool
	AllowGithubSSO bool

	// Worker specific configuration
	WorkerConcurrency int `validate:"gte=0"`

	// Frontend specific configuration
	FrontendPort int `validate:"gte=1,lte=65535"`

	// API specific configuration
	APIPort int `validate:"gte=1,lte=65535"`

	// Cron specific configuration
	HeartbeatInterval int `validate:"gte=1,lte=3600"`
}

func LoadConfig() Config {
	var err error

	redisAddr := "localhost:6379"
	if value := os.Getenv("REDIS_ADDR"); value != "" {
		redisAddr = value
	}

	redisPassword := ""
	if value := os.Getenv("REDIS_PASSWORD"); value != "" {
		redisPassword = value
	}

	postgresDSN := ""
	if value := os.Getenv("POSTGRES_DSN"); value != "" {
		postgresDSN = value
	}

	heartbeatInterval := 60
	if value := os.Getenv("HEARTBEAT_INTERVAL"); value != "" {
		heartbeatInterval, err = strconv.Atoi(value)
		if err != nil {
			log.Fatalf("invalid heartbeat interval: %v", err)
		}
	}

	apiPort := 5050
	if value := os.Getenv("API_PORT"); value != "" {
		apiPort, err = strconv.Atoi(value)
		if err != nil {
			log.Fatalf("invalid API port: %v", err)
		}
	}

	frontendPort := 4951
	if value := os.Getenv("FRONTEND_PORT"); value != "" {
		frontendPort, err = strconv.Atoi(value)
		if err != nil {
			log.Fatalf("invalid FRONTEND_PORT: %v", err)
		}
	}

	withFrontend := true
	if value := os.Getenv("WITH_FRONTEND"); value != "" {
		withFrontend, err = strconv.ParseBool(value)
		if err != nil {
			log.Fatalf("invalid WITH_FRONTEND value: %v", err)
		}
	}

	withAPI := true
	if value := os.Getenv("WITH_API"); value != "" {
		withAPI, err = strconv.ParseBool(value)
		if err != nil {
			log.Fatalf("invalid WITH_API value: %v", err)
		}
	}

	withWorker := true
	if value := os.Getenv("WITH_WORKER"); value != "" {
		withWorker, err = strconv.ParseBool(value)
		if err != nil {
			log.Fatalf("invalid WITH_WORKER value: %v", err)
		}
	}

	mode := "monolith"
	if value := os.Getenv("MODE"); value != "" {
		mode = strings.ToLower(value)

		switch mode {
		case "monolith":
			withAPI = true
			withFrontend = true
			withWorker = true
		case "backend":
			withAPI = true
			withFrontend = false
			withWorker = true
		case "frontend-only":
			withAPI = false
			withFrontend = true
			withWorker = false
		case "api-only":
			withAPI = true
			withFrontend = false
			withWorker = false
		case "worker-only":
			withAPI = false
			withFrontend = false
			withWorker = true
		default:
			log.Fatalf("invalid MODE value: %s", mode)
		}
	}

	env := "production"
	if value := os.Getenv("ENV"); value != "" {
		env = strings.ToLower(value)
	}

	allowGoogleSSO := true
	if value := os.Getenv("ALLOW_GOOGLE_SSO"); value != "" {
		allowGoogleSSO, err = strconv.ParseBool(value)
		if err != nil {
			log.Fatalf("invalid ALLOW_GOOGLE_SSO value: %v", err)
		}
	}

	allowGithubSSO := true
	if value := os.Getenv("ALLOW_GITHUB_SSO"); value != "" {
		allowGithubSSO, err = strconv.ParseBool(value)
		if err != nil {
			log.Fatalf("invalid ALLOW_GITHUB_SSO value: %v", err)
		}
	}

	// Zero concurrency means it will use up all usable CPUs.
	workerConcurrency := 0
	if value := os.Getenv("WORKER_CONCURRENCY"); value != "" {
		workerConcurrency, err = strconv.Atoi(value)
		if err != nil {
			log.Fatalf("invalid WORKER_CONCURRENCY: %v", err)
		}
	}

	return Config{
		RedisAddr:         redisAddr,
		RedisPassword:     redisPassword,
		PostgresDSN:       postgresDSN,
		HeartbeatInterval: heartbeatInterval,
		APIPort:           apiPort,
		FrontendPort:      frontendPort,
		WithFrontend:      withFrontend,
		WithAPI:           withAPI,
		WithWorker:        withWorker,
		Env:               env,
		Mode:              mode,
		AllowGoogleSSO:    allowGoogleSSO,
		AllowGithubSSO:    allowGithubSSO,
		WorkerConcurrency: workerConcurrency,
	}
}

func New() Config {
	cfg := LoadConfig()

	validate := validator.New(validator.WithRequiredStructEnabled())
	err := validate.Struct(cfg)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			switch err.StructField() {
			case "RedisAddr":
				log.Printf("invalid REDIS_ADDR (%v): %s", err.Value(), err.Error())
			case "PostgresDSN":
				log.Printf("invalid POSTGRES_DSN (%v): %s", err.Value(), err.Error())
			case "HeartbeatInterval":
				log.Printf("invalid HEARTBEAT_INTERVAL (%v): it must be between 1 to 3600 seconds", err.Value())
			case "APIPort":
				log.Printf("invalid API_PORT (%v): it must be between 1 to 65535", err.Value())
			case "FrontendPort":
				log.Printf("invalid FRONTEND_PORT (%v): it must be between 1 to 65535", err.Value())
			case "Env":
				log.Printf("invalid ENV (%v): %s", err.Value(), err.Error())
			case "Mode":
				log.Printf("invalid MODE (%v): it must be one of monolith, backend, frontend-only, api-only, worker-only", err.Value())
			case "WithFrontend":
				log.Printf("invalid WITH_FRONTEND (%v): %s", err.Value(), err.Error())
			case "WithAPI":
				log.Printf("invalid WITH_API (%v): %s", err.Value(), err.Error())
			case "WithWorker":
				log.Printf("invalid WITH_WORKER (%v): %s", err.Value(), err.Error())
			default:
				log.Printf("invalid %s (%v): %s", err.StructField(), err.Value(), err.Error())
			}

		}

		log.Fatal()
	}

	return cfg
}
