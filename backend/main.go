package main

import (
	"database/sql"
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

	"github.com/rs/cors"
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

	mux := http.NewServeMux()

	mux.HandleFunc("POST /login", loginHandler)
	mux.HandleFunc("POST /users", createUserHandler)
	mux.HandleFunc("PATCH /users", patchUserHandler)
	mux.HandleFunc("GET /users/{name}", getUserHandler)

	handler := cors.AllowAll().Handler(mux)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func validateUser(user db.User) error {
	if utf8.RuneCountInString(user.Name) > consts.USER_NANE_MAX_LENGTH {
		return errors.New(consts.NAME_IS_TOO_LONG)
	}

	if utf8.RuneCountInString(user.Bio.V) > consts.USER_BIO_MAX_LENGTH {
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
	user, err := db.GetUserByName(r.PathValue("name"))
	if err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	user.Password = ""
	if err := json.NewEncoder(w).Encode(user); err != nil {
		log.Println(err)
	}
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	var user db.User
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

func patchUserHandler(w http.ResponseWriter, r *http.Request) {
	var user db.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println(err)
		return
	}

	if err := validateUser(user); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		log.Println(err)
		return
	}

	patchMap := map[string]any{}
	if user.Name != "" {
		patchMap["name"] = user.Name
	}
	if user.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
		if err != nil {
			writeResponse(w, http.StatusInternalServerError, newErrorResponse(err))
			log.Println(err)
			return
		}
		patchMap["password"] = string(hashed)
	}
	if user.Birthday.Valid {
		if user.Birthday.V.IsZero() {
			patchMap["birthday"] = sql.Null[time.Time]{}
		} else {
			patchMap["birthday"] = user.Birthday
		}

	}
	if user.Bio.Valid {
		if user.Bio.V == "" {
			patchMap["bio"] = sql.Null[string]{V: "", Valid: false}
		} else {
			patchMap["bio"] = user.Bio
		}

	}
	patchMap["updated_at"] = time.Now()

	if err := db.PatchUser(user.Id, patchMap); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		log.Println(err)
		return
	}
}
