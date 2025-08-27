package http

import (
"fmt"
"os"
"github.com/gofiber/fiber/v2"
dbpkg "github.com/phatchau9/cloud-notes-app/backend/internal/db"
)

type Server struct { app *fiber.App }


func NewServer() *Server {
app := fiber.New()
s := &Server{app: app}


// CORS (simple)
corsOrigin := os.Getenv("CORS_ORIGIN")
app.Use(func(c *fiber.Ctx) error {
c.Set("Access-Control-Allow-Origin", corsOrigin)
c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
if c.Method() == fiber.MethodOptions { return c.SendStatus(fiber.StatusNoContent) }
return c.Next()
})


// DB connect
dsn := os.Getenv("DB_DSN")
db, err := dbpkg.Open(dsn)
if err != nil { panic(err) }

// Routes
RegisterRoutes(app, db)
return s
}

func (s *Server) Listen(port string) error {
return s.app.Listen(fmt.Sprintf(":%s", port))
}