package http

import (
	"context"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/phatch9/cloud-notes-app/backend/internal/models"
)

func NewServer(db *pgxpool.Pool) *fiber.App {
	app := fiber.New()

	// Root route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to Cloud Notes API. Visit /healthz to check status.",
		})
	})

	// Health check
	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
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

	// GET one note by ID
	app.Get("/notes/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid id")
		}

		var n models.Note
		err = db.QueryRow(
			context.Background(),
			"SELECT id, user_id, title, content, created_at FROM notes WHERE id=$1",
			id,
		).Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.CreatedAt)

		if err != nil {
			return fiber.NewError(fiber.StatusNotFound, "note not found")
		}
		return c.JSON(n)
	})

	// POST create note
	app.Post("/notes", func(c *fiber.Ctx) error {
		var input models.Note
		if err := c.BodyParser(&input); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid input")
		}

		err := db.QueryRow(
			context.Background(),
			"INSERT INTO notes (user_id, title, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, created_at",
			input.UserID, input.Title, input.Content,
		).Scan(&input.ID, &input.CreatedAt)

		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.Status(fiber.StatusCreated).JSON(input)
	})

	// PUT update note
	app.Put("/notes/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid id")
		}

		var input models.Note
		if err := c.BodyParser(&input); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid input")
		}

		_, err = db.Exec(
			context.Background(),
			"UPDATE notes SET title=$1, content=$2 WHERE id=$3",
			input.Title, input.Content, id,
		)

		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.JSON(fiber.Map{"updated": id})
	})

	// DELETE note
	app.Delete("/notes/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid id")
		}

		_, err = db.Exec(
			context.Background(),
			"DELETE FROM notes WHERE id=$1", id,
		)

		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.JSON(fiber.Map{"deleted": id})
	})

	return app
}
