package main

import (
	"log"
	"os"

	appHttp "github.com/phatch9/cloud-notes-app/backend/internal/http"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := appHttp.NewServer()
	// function http.NewServer() must return a *fiber.App or equivalent.
	addr := ":" + port // Fiber needs ":8080"
	log.Printf("starting api on %s", addr)

	if err := srv.Listen(addr); err != nil { // currently passing srv.Listen(port) which will fail.
		log.Fatal(err)
	}
}
