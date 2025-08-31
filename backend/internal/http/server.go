package http

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/phatch9/cloud-notes-app/backend/internal/models"
)

func NewServer(db *pgxpool.Pool) *fiber.App {
	app := fiber.New()
	RegisterRoutes(app, db)

	// health check route
	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok"})
	})
	// GET all notes
	app.Get("/notes", func(c *fiber.Ctx) error {
		rows, err := db.Query(context.Background(),
			"SELECT id, user_id, title, content, created_at FROM notes ORDER BY id DESC")
		if err != nil {
			return err
		}
		defer rows.Close()

		var notes []models.Note
		for rows.Next() {
			var n models.Note
			if err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.CreatedAt); err != nil {
				return err
			}
			notes = append(notes, n)
		}
		return c.JSON(notes)
	})

	// POST create note
	app.Post("/notes", func(c *fiber.Ctx) error {
		var input models.Note
		if err := c.BodyParser(&input); err != nil {
			return err
		}

		err := db.QueryRow(
			context.Background(),
			"INSERT INTO notes (user_id, title, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, created_at",
			input.UserID, input.Title, input.Content,
		).Scan(&input.ID, &input.CreatedAt)

		if err != nil {
			return err
		}

		return c.Status(201).JSON(input)
	})
	return app
}
