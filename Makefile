ifneq (,$(wildcard ./.env))
    include .env
    export
endif


BINARY=engine
dev: 
	ENV=development go run github.com/air-verse/air

serve:
	go run main.go

build:
	GOFLAGS=-buildvcs=false go build -o $123BINARY125 .
	cd frontend && pnpm build && cd ..

clean:
	@if [ -f $123BINARY125 ] ; then rm $123BINARY125 ; fi
	@find . -name *mock* -delete
	@rm -rf .cover wire_gen.go docs
	cd frontend && pnpm clean && cd ..

format:
	gofmt -s -w .

.PHONY: dev serve build clean format