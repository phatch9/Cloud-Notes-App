package models

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Note struct {
	ID        int       `json:"id"`
	UserID    string    `json:"userId"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

// ListNotes returns all notes for a given user
func ListNotes(ctx context.Context, db *pgxpool.Pool, userID string) ([]Note, error) {
	rows, err := db.Query(ctx,
		`SELECT id, user_id, title, content, created_at 
		 FROM notes 
		 WHERE user_id=$1 
		 ORDER BY id DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Note
	for rows.Next() {
		var n Note
		if err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, n)
	}
	return out, rows.Err()
}

// CreateNote inserts a new note and returns it
func CreateNote(ctx context.Context, db *pgxpool.Pool, userID, title, content string) (*Note, error) {
	var n Note
	err := db.QueryRow(ctx,
		`INSERT INTO notes (user_id, title, content, created_at) 
		 VALUES ($1, $2, $3, NOW()) 
		 RETURNING id, user_id, title, content, created_at`,
		userID, title, content,
	).Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &n, nil
}

// GetNote fetches a single note by ID (and user)
func GetNote(ctx context.Context, db *pgxpool.Pool, id int, userID string) (*Note, error) {
	var n Note
	err := db.QueryRow(ctx,
		`SELECT id, user_id, title, content, created_at 
		 FROM notes 
		 WHERE id=$1 AND user_id=$2`,
		id, userID,
	).Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &n, nil
}

// DeleteNote removes a note by ID (and user)
func DeleteNote(ctx context.Context, db *pgxpool.Pool, id int, userID string) error {
	_, err := db.Exec(ctx,
		`DELETE FROM notes WHERE id=$1 AND user_id=$2`,
		id, userID,
	)
	return err
}
