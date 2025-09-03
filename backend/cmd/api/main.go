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

	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Fatal("DB_DSN not set")
	}

	// Initialize DB connection
	pool, err := db.Open(dsn)
	if err != nil {
		log.Fatalf("db connection failed: %v", err)
	}

	srv := appHttp.NewServer(pool)
	addr := ":" + port
	log.Printf("starting api on %s", addr)

	if err := srv.Listen(addr); err != nil {
		log.Fatal(err)
	}
}
