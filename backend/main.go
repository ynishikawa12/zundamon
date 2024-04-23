package main

import (
	"fmt"
	"net/http"
	"encoding/json"
	"github.com/rs/cors"
	"github.com/gorilla/mux"
)

//DBテーブル用（未実装）
type ZundaVoiceData struct {
	Line string `json:"line"`
	Voice []byte `json:"voice"`
}

func main() {
	r := mux.NewRouter()
	r.Methods("POST", "OPTIONS").Path("/insertVoice").HandlerFunc(insertVoice)
	c := cors.AllowAll().Handler(r)

	http.ListenAndServe(":8080", c)
}

//DBテーブルにinsert（未完成）
func insertVoice(w http.ResponseWriter, r *http.Request) {
	var data ZundaVoiceData
	json.NewDecoder(r.Body).Decode(&data)

	fmt.Println(data)

	json.NewEncoder(w).Encode(data)

}