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

	// Auth endpoint (demo login, always returns a token for "demo")
	app.Post("/login", func(c *fiber.Ctx) error {
		token, err := auth.IssueToken("demo")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.JSON(fiber.Map{"token": token})
	})

	api := app.Group("/api", auth.Middleware)

	api.Get("/notes", func(c *fiber.Ctx) error {
		userId := c.Locals("userId").(string)

		notes, err := models.ListNotes(c.Context(), db, userId)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.JSON(notes)
	})

	api.Post("/notes", func(c *fiber.Ctx) error {
		var req createNoteReq
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "bad json")
		}

		userId := c.Locals("userId").(string)

		// Call CreateNote with correct args
		note, err := models.CreateNote(
			c.Context(),
			db,
			userId,
			req.Title,
			req.Content,
		)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		// Add createdAt before returning
		note.CreatedAt = time.Now()

		return c.Status(fiber.StatusCreated).JSON(note)
	})
}
