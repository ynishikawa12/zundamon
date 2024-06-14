package model

import "time"

type User struct {
	Name     string     `json:"name"`
	Password string     `json:"password"`
	Birthday *time.Time `json:"birthday"`
	Bio      *string    `json:"bio"`
}
