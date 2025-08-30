package models

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Note struct {
	ID        int       `json:"id"`
	UserID    string    `json:"user_id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// CreateNote inserts a new note
func CreateNote(ctx context.Context, db *pgxpool.Pool, n *Note) error {
	err := db.QueryRow(
		ctx,
		`INSERT INTO notes (user_id, title, content, created_at)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id`,
		n.UserID, n.Title, n.Content, n.CreatedAt,
	).Scan(&n.ID)

	return err
}

// ListNotes fetches all notes for a user
func ListNotes(ctx context.Context, db *pgxpool.Pool, userID string) ([]Note, error) {
	rows, err := db.Query(
		ctx,
		`SELECT id, user_id, title, content, created_at
		 FROM notes
		 WHERE user_id = $1
		 ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []Note
	for rows.Next() {
		var n Note
		if err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.CreatedAt); err != nil {
			return nil, err
		}
		notes = append(notes, n)
	}

	return notes, rows.Err()
}
