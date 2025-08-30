package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Replace with env/config later
var jwtSecret = []byte("supersecret")

// IssueToken creates a signed JWT for a user
func IssueToken(userID string) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,                                // subject: user id
		"exp": time.Now().Add(24 * time.Hour).Unix(), // expiration
		"iat": time.Now().Unix(),                     // issued at
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
