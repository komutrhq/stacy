ifneq (,$(wildcard ./.env))
    include .env
    export
endif


BINARY=engine
dev: 
	ENV=development go run github.com/air-verse/air

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