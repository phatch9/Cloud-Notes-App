package main

import (
	"log"
	"os"

	"github.com/phatch9/cloud-notes-app/backend/internal/http"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	srv := http.NewServer()
	log.Printf("starting api on :%s", port)
	if err := srv.Listen(port); err != nil {
		log.Fatal(err)
	}
}
