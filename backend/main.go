package main

import (
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"strings"
)

func main() {
	var err error

	err = InitDB()
	if err != nil {
		fmt.Println(err)
	}
	// リクエストハンドラ
	http.HandleFunc("/login", loginHandler)

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("got request")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

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
	authPasswordEnc := string(authArray[1])

	user, err := GetUser(string(authName))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if user.enc == authPasswordEnc {
		w.WriteHeader(http.StatusNoContent)
		return
	} else {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

}
