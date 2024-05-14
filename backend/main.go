package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func main() {
	// リクエストハンドラ
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
	fmt.Println("got request")
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
	authArray := strings.Split(auth, ":")
	// ユーザー名取得
	authName, err := base64.StdEncoding.DecodeString(authArray[0])
	if err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	// パスワード取得
	authPassword, err := base64.StdEncoding.DecodeString(authArray[1])
	if err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	user, err := GetUser(string(authName))
	if err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	// パスワード比較
	if err := bcrypt.CompareHashAndPassword([]byte(user.password), authPassword); err != nil {
		writeResponse(w, http.StatusBadRequest, newErrorResponse(err))
		return
	}

	w.WriteHeader(http.StatusNoContent)

}
