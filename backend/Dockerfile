# Use official Go image
FROM golang:1.21 AS builder

WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build binary
RUN go build -o server ./cmd/server

# Small runtime image
FROM debian:bullseye-slim

WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/.env .   # optional if you keep env file

EXPOSE 8080

CMD ["./server"]
