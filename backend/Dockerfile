# Build stage
FROM golang:1.25 AS builder
WORKDIR /app

# Copy mod files first for caching
COPY go.mod go.sum ./

RUN go mod download
RUN go mod tidy

# Copy the rest of the code
COPY . .

# Build the app for Linux/arm64 with CGO disabled
RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o server ./cmd/api

# Runtime stage
FROM debian:bookworm-slim
WORKDIR /app

# Copy built binary
COPY --from=builder /app/server .

# Set environment variable for port
ENV PORT=8088
EXPOSE 8088

# Start the server
CMD ["./server"]
