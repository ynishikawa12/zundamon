package db

import (
	"database/sql"
	"time"

	"github.com/go-sql-driver/mysql"
)

type User struct {
	Id        int                 `json:"id"`
	Name      string              `json:"name"`
	Password  string              `json:"password"`
	Birthday  sql.Null[time.Time] `json:"birthday"`
	Bio       sql.Null[string]    `json:"bio"`
	CreatedAt time.Time           `json:"created_at"`
	UpdatedAt time.Time           `json:"updated_at"`
}

var DB *sql.DB

func InitDB() error {
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		return err
	}

	c := mysql.Config{
		DBName:    "zundamon_db",
		User:      "root",
		Passwd:    "ikuradon1123",
		Addr:      "localhost:3306",
		Net:       "tcp",
		ParseTime: true,
		Collation: "utf8mb4_unicode_ci",
		Loc:       jst,
	}

	var error error
	DB, error = sql.Open("mysql", c.FormatDSN())
	if error != nil {
		return error
	}

	return nil
}
