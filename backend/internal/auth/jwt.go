package auth

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("supersecret") // later: load from env

func Middleware(c *fiber.Ctx) error {
	// Expect: Authorization: Bearer <token>
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "missing token")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid token format")
	}

	tokenStr := parts[1]

	// Parse and validate JWT
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid token")
	}

	// Extract claims
	claims := token.Claims.(jwt.MapClaims)
	userID, ok := claims["sub"].(string)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid claims")
	}

	// Store userId in context
	c.Locals("userId", userID)

	// Continue request
	return c.Next()
}
