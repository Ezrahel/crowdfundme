package usermgt

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type ClerkUser struct {
	// Email     *string `json:"email," binding:"required"`
	Password  string `json:"password" binding:"required"`
	Username  string `json:"username" binding:"required"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

const CreateUserTable = `CREATE TABLE IF NOT EXISTS user (
id SERIAL PRIMARY KEY,)`

func ClerkUserMgt(ctx *gin.Context) {
	wd, err := os.Getwd()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Error location env file",
		})
		return
	}
	envPath := filepath.Join(wd, "/../../.env")
	err = godotenv.Load(envPath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "error locating env",
		})
		return
	}
	env := os.Getenv("CLERK_KEY")
	if env == "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "CLERK_KEY not found in environment variables",
		})
		return
	}

	clerk.SetKey(env)

	var userData ClerkUser
	if err := ctx.ShouldBindJSON(&userData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request data: " + err.Error(),
		})
		return
	}

	newUser, err := user.Create(ctx, &user.CreateParams{
		// EmailAddresses: []string{userData.Email},
		Username:  &userData.Username,
		Password:  &userData.Password,
		FirstName: &userData.FirstName,
		LastName:  &userData.LastName,
		// PublicMetadata: map[string]interface{}{
		// 	"role": "user",
		// },
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "could not create user: " + err.Error(),
		})
		return
	}

	fmt.Printf("new user %v", newUser)
	ctx.JSON(http.StatusCreated, newUser)

	// userDetails, err := client.Get(ctx, "user_id")
	// if err != nil {
	// 	// Handle error
	// }

	// userList, err := client.List(ctx, &user.ListParams{})
	// if err != nil {
	// 	// Handle error
	// }
	// for _, u := range userList.Users {
	// 	// Process each user
	// }

	// deletedResource, err := client.Delete(ctx, "user_id")
	// if err != nil {
	// 	// Handle error
	// }
}
