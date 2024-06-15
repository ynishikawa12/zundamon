package model

import (
	"time"
)

type CustomDate struct {
	time.Time
}

func (cd *CustomDate) UnmarshalJSON(b []byte) error {
	const layout = "2006-01-02"

	// 引数bは二重引用符を含んでいるので、取り除く
	str := string(b)
	str = str[1 : len(str)-1]

	t, err := time.Parse(layout, str)
	if err != nil {
		return err
	}

	cd.Time = t
	return nil
}

type User struct {
	Id       int        `json:"id"`
	Name     string     `json:"name"`
	Birthday *time.Time `json:"birthday,omitempty"`
	Bio      *string    `json:"bio,omitempty"`
}

type CreateUser struct {
	Name     string     `json:"name"`
	Password string     `json:"password"`
	Birthday *time.Time `json:"birthday"`
	Bio      *string    `json:"bio"`
}

type UpdateUser struct {
	Name     *string     `json:"name"`
	Password *string     `json:"password"`
	Birthday *CustomDate `json:"birthday"`
	Bio      *string     `json:"bio"`
}
