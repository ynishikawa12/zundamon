package main

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
	"time"
	"unicode/utf8"

	"zundamon/consts"
	"zundamon/db"

	"golang.org/x/crypto/bcrypt"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func main() {
	if err := db.InitDB(); err != nil {
		log.Fatal(err)
	}
	defer db.DB.Close()

	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/users", createUserHandler)
	http.HandleFunc("/users/{name}", getUserHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func validateUser(user db.User) error {
	if utf8.RuneCountInString(user.Name) > consts.USER_NANE_MAX_LENGTH {
		return errors.New(consts.NAME_IS_TOO_LONG)
	}

	const userBioCountLimit = 200
	if utf8.RuneCountInString(user.Bio.V) > userBioCountLimit {
		return errors.New(consts.BIO_IS_TOO_LONG)
	}

	return nil
}

func newErrorResponse(err error) ErrorResponse {
	return ErrorResponse{Error: err.Error()}
}

func writeResponse(w http.ResponseWriter, code int, body any) {
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Println(err)
	}
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

	user, err := db.GetUserByName(string(userName))
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

	user, err := db.GetUserByName(r.PathValue("name"))
	if err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	user.Password = ""
	if err := json.NewEncoder(w).Encode(user); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}
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

	user := db.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println(err)
		return
	}

	if err := validateUser(user); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		log.Println(err)
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		writeResponse(w, http.StatusInternalServerError, newErrorResponse(err))
		log.Println(err)
		return
	}
	user.Password = string(hashed)

	now := time.Now()
	user.Created_at = now
	user.Updated_at = now

	if err := db.CreateUser(user); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
