package model

import "time"

type VoiceText struct {
	Text string `json:"text"`
}

type Voice struct {
	Text      string    `json:"text"`
	Voice     string    `json:"voice"`
	CreatedAt time.Time `json:"createdAt"`
}
