package http


import (
"time"
"github.com/gofiber/fiber/v2"
"github.com/jackc/pgx/v5/pgxpool"
"github.com/yourname/cloud-notes/backend/internal/models"
"github.com/yourname/cloud-notes/backend/internal/auth"
)


type createNoteReq struct { Title string `json:"title"`; Content string `json:"content"` }


func RegisterRoutes(app *fiber.App, db *pgxpool.Pool) {
app.Get("/health", func(c *fiber.Ctx) error { return c.JSON(fiber.Map{"ok": true}) })


// Auth (demo: hardcoded user "demo")
app.Post("/login", func(c *fiber.Ctx) error {
token, err := auth.IssueToken("demo")
if err != nil { return fiber.NewError(500, err.Error()) }
return c.JSON(fiber.Map{"token": token})
})


api := app.Group("/api", auth.Middleware)


api.Get("/notes", func(c *fiber.Ctx) error {
notes, err := models.ListNotes(c.Context(), db, "demo")
if err != nil { return fiber.NewError(500, err.Error()) }
return c.JSON(notes)
})


api.Post("/notes", func(c *fiber.Ctx) error {
var req createNoteReq
if err := c.BodyParser(&req); err != nil { return fiber.NewError(400, "bad json") }
n := models.Note{ UserID: "demo", Title: req.Title, Content: req.Content, CreatedAt: time.Now() }
if err := models.CreateNote(c.Context(), db, &n); err != nil { return fiber.NewError(500, err.Error()) }
return c.Status(201).JSON(n)
})
}