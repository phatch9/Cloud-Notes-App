// Initialized Fiber Middleware

package auth

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

// Middleware validates JWT and extracts userId into c.Locals("userId")
func Middleware(c *fiber.Ctx) error {
	// Get the Authorization header
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "missing authorization header")
	}

	// Expect format: Bearer <token>
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid authorization header format")
	}

	// Validate token
	claims, err := ParseToken(parts[1])
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid or expired token")
	}

	// Store userId in Fiber context
	c.Locals("userId", claims.UserID)

	// Continue to next handler
	return c.Next()
}
