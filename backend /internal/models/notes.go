package models


import (
"context"
"time"
"github.com/jackc/pgx/v5/pgxpool"
)


type Note struct {
ID int `json:"id"`
UserID string `json:"userId"`
Title string `json:"title"`
Content string `json:"content"`
CreatedAt time.Time `json:"createdAt"`
}


func ListNotes(ctx context.Context, db *pgxpool.Pool, userID string) ([]Note, error) {
rows, err := db.Query(ctx, `SELECT id, user_id, title, content, created_at FROM notes WHERE user_id=$1 ORDER BY id DESC`, userID)
if err != nil { return nil, err }
defer rows.Close()
var out []Note
for rows.Next() {
var n Note
if err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.CreatedAt); err != nil { return nil, err }
out = append(out, n)
}
return out, rows.Err()
}


func