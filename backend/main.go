package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"zundamon/db"

	"golang.org/x/crypto/bcrypt"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func main() {
	db.InitDB()
	defer db.GetDB().Close()

	http.HandleFunc("/login", loginHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func newErrorResponse(err error) ErrorResponse {
	return ErrorResponse{Error: err.Error()}
}

func writeResponse(w http.ResponseWriter, code int, body any) {
	json.NewEncoder(w).Encode(body)
	w.WriteHeader(code)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("got request login")
	headers := map[string]string{
		"Access-Control-Allow-Origin":  "http://localhost:5173",
		"Access-Control-Allow-Headers": "*",
		"Access-Control-Allow-Methods": "POST",
	}

	for k, v := range headers {
		w.Header().Set(k, v)
	}

	if r.Method == "OPTIONS" {
		return
	}

	auth := r.Header.Get("Authorization")
	decoded, err := base64.StdEncoding.DecodeString(auth)
	if err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}
	authArray := strings.Split(string(decoded), ":")

	userName := authArray[0]
	authPassword := authArray[1]

	user, err := db.GetUser(string(userName))
	if err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(authPassword)); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
