package db


import (
"context"
"github.com/jackc/pgx/v5/pgxpool"
)


func Open(dsn string) (*pgxpool.Pool, error) {
cfg, err := pgxpool.ParseConfig(dsn)
if err != nil { return nil, err }
pool, err := pgxpool.NewWithConfig(context.Background(), cfg)
if err != nil { return nil, err }


// Ensure table exists
_, err = pool.Exec(context.Background(), `
CREATE TABLE IF NOT EXISTS notes (
id SERIAL PRIMARY KEY,
user_id TEXT NOT NULL,
title TEXT NOT NULL,
content TEXT NOT NULL,
created_at TIMESTAMP NOT NULL
);`)
return pool, err
}