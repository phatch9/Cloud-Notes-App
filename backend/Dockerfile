# Build stage
FROM golang:1.21 AS builder

WORKDIR /app

# Copy mod files first for better caching
COPY go.mod go.sum ./

# Ensure dependencies are downloaded and tidy up
RUN go mod download
RUN go mod tidy

# Copy the rest of the code
COPY . .

# Build the app
RUN go build -o server ./cmd/api

# Runtime stage
FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
CMD ["./server"]
