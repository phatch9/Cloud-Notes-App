package http

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/phatch9/cloud-notes-app/backend/internal/auth"
	"github.com/phatch9/cloud-notes-app/backend/internal/models"
)

type createNoteReq struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

func RegisterRoutes(app *fiber.App, db *pgxpool.Pool) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true})
	})

	// Auth (demo: hardcoded login for now)
	app.Post("/login", func(c *fiber.Ctx) error {
		token, err := auth.IssueToken("demo")
		if err != nil {
			return fiber.NewError(500, err.Error())
		}
		return c.JSON(fiber.Map{"token": token})
	})

	api := app.Group("/api", auth.Middleware)

	// List notes
	api.Get("/notes", func(c *fiber.Ctx) error {
		userId, ok := c.Locals("userId").(string)
		if !ok || userId == "" {
			return fiber.NewError(401, "unauthorized")
		}

		notes, err := models.ListNotes(c.Context(), db, userId)
		if err != nil {
			return fiber.NewError(500, err.Error())
		}
		return c.JSON(notes)
	})

	// Create note
	api.Post("/notes", func(c *fiber.Ctx) error {
		userId, ok := c.Locals("userId").(string)
		if !ok || userId == "" {
			return fiber.NewError(401, "unauthorized")
		}

		var req createNoteReq
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(400, "bad json")
		}

		n := models.Note{
			UserID:    userId,
			Title:     req.Title,
			Content:   req.Content,
			CreatedAt: time.Now(),
		}

		if err := models.CreateNote(c.Context(), db, &n); err != nil {
			return fiber.NewError(500, err.Error())
		}
		return c.Status(201).JSON(n)
	})
}
