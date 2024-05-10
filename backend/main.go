package main

import (
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	if err := InitDB(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	// リクエストハンドラ
	http.HandleFunc("/login", loginHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
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
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// パスワード取得
	authPassword, err := base64.StdEncoding.DecodeString(authArray[1])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	user, err := GetUser(string(authName))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// パスワード比較
	if err := bcrypt.CompareHashAndPassword([]byte(user.password), authPassword); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	} else {
		w.WriteHeader(http.StatusNoContent)
	}

}
