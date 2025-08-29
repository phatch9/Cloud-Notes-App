package auth

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/valyala/fasthttp"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type Claims struct {
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

// IssueToken generates a JWT for a user
func IssueToken(userID string) (string, error) {
	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// Middleware checks Authorization header for valid JWT
func Middleware(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		authHeader := string(ctx.Request.Header.Peek("Authorization"))
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			ctx.SetStatusCode(http.StatusUnauthorized)
			ctx.SetBody([]byte("missing or invalid auth header"))
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !token.Valid {
			ctx.SetStatusCode(http.StatusUnauthorized)
			ctx.SetBody([]byte("invalid token"))
			return
		}

		// add user ID to context
		ctx.SetUserValue("userId", claims.UserID)
		next(ctx)
	}
}
