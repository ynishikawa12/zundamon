package main

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

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
	http.HandleFunc("/users", createUserHandler)
	http.HandleFunc("/users/{name}", getUserHandler)

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

func getUserHandler(w http.ResponseWriter, r *http.Request) {
	headers := map[string]string{
		"Access-Control-Allow-Origin":  "http://localhost:5173",
		"Access-Control-Allow-Headers": "*",
		"Access-Control-Allow-Methods": "GET",
	}

	for k, v := range headers {
		w.Header().Set(k, v)
	}

	if r.Method == "OPTIONS" {
		return
	}

	user, err := db.GetUser(r.PathValue("name"))
	if err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	user.Password = ""
	json.NewEncoder(w).Encode(user)
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
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

	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		return
	}

	var user db.User
	if err := json.Unmarshal(bytes, &user); err != nil {
		log.Println(err)
		return
	}

	hashed, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	user.Password = string(hashed)

	user.Created_at = time.Now()
	user.Updated_at = time.Now()

	if err := db.CreateUser(user); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
