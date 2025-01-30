ifneq (,$(wildcard ./.env))
    include .env
    export
endif


BINARY=engine
dev: 
	docker run --name stacy-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=stacy -p 5432:5432 -d postgres:16-alpine || true
	docker run --name stacy-redis -e REDIS_PASSWORD=secret -p 6380:6379 -d redis:alpine || true
	REDIS_ADDR="localhost:6380" REDIS_PASSWORD="secret" POSTGRES_DSN="host=localhost user=admin password=secret dbname=stacy port=5432 sslmode=disable TimeZone=Asia/Singapore" ENV=development go run github.com/air-verse/air

serve:
	cd frontend && pnpm build && cd ..
	go run main.go

clean:
	@find . -name *mock* -delete
	@rm -rf .cover wire_gen.go docs
	cd frontend && pnpm clean && cd ..

format:
	gofmt -s -w .
	cd frontend && pnpm format && cd ..

.PHONY: dev serve build clean format