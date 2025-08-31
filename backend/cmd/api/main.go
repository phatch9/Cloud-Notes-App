package main

import (
	"log"
	"os"

	"github.com/phatch9/cloud-notes-app/backend/internal/db"
	appHttp "github.com/phatch9/cloud-notes-app/backend/internal/http"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8088"
	}

	// Initialize DB connection
	dsn := os.Getenv("DB_DSN")
	pool, err := db.Open(dsn)
	if err != nil {
		log.Fatalf("db connection failed: %v", err)
	}

	srv := appHttp.NewServer(pool)
	// function http.NewServer() must return a *fiber.App or equivalent.
	addr := ":" + port // Fiber needs ":8088"
	log.Printf("starting api on %s", addr)

	if err := srv.Listen(addr); err != nil { // currently passing srv.Listen(port) which will fail.
		log.Fatal(err)
	}
}
