package main

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
	"unicode/utf8"

	"zundamon/errors"
	"zundamon/model"

	"database/sql"

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

func newErrorResponse(err error) ErrorResponse {
	return ErrorResponse{Error: err.Error()}
}

func writeResponse(w http.ResponseWriter, code int, body any) {
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Println(err)
	}
	w.WriteHeader(code)
}

func validateUser(user model.User) error {
	if utf8.RuneCountInString(user.Name) > consts.USER_NANE_MAX_LENGTH {
		return errors.ErrorNameIsTooLong
	}

	if user.Bio != nil && utf8.RuneCountInString(*user.Bio) > consts.USER_BIO_MAX_LENGTH {
		return errors.ErrorBioIsTooLong
	}
	return nil
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
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	var user model.User
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

	var birthday sql.Null[time.Time]
	if user.Birthday != nil {
		birthday.V = *user.Birthday
		birthday.Valid = true
	}

	var bio sql.Null[string]
	if user.Bio != nil {
		bio.V = *user.Bio
		birthday.Valid = true
	}

	now := time.Now()
	dbUser := db.User{
		Name:      user.Name,
		Password:  string(hashed),
		Birthday:  birthday,
		Bio:       bio,
		CreatedAt: now,
		UpdatedAt: now,
	}

	if err := db.CreateUser(dbUser); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func patchUserHandler(w http.ResponseWriter, r *http.Request) {
	var user model.User
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
	//if user.Birthday.Valid {
	//	if user.Birthday.V.IsZero() {
	//		patchMap["birthday"] = sql.Null[time.Time]{}
	//	} else {
	//		patchMap["birthday"] = user.Birthday
	//	}

	//}
	//if user.Bio.Valid {
	//	if user.Bio.V == "" {
	//		patchMap["bio"] = sql.Null[string]{V: "", Valid: false}
	//	} else {
	//		patchMap["bio"] = user.Bio
	//	}

	//}
	//patchMap["updated_at"] = time.Now()

	//if err := db.PatchUser(user.Id, patchMap); err != nil {
	//	writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
	//	log.Println(err)
	//	return
	//}
}
