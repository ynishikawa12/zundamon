package main

import (
	"database/sql"
	"time"

	"github.com/go-sql-driver/mysql"
)

type User struct {
	id         int
	name       string
	password   string
	birthday   sql.Null[time.Time]
	bio        string
	created_at time.Time
	updated_at time.Time
}

// DB接続
func connectDB() (db *sql.DB, err error) {
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		return db, err
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

	db, err = sql.Open("mysql", c.FormatDSN())
	if err != nil {
		return db, err
	}

	return db, err
}

// 名前からユーザー取得
func GetUser(name string) (User, error) {
	var user User
	db, err := connectDB()
	if err != nil {
		return user, err
	}
	defer db.Close()

	sql := "SELECT * FROM users WHERE name = ?;"
	err = db.QueryRow(sql, name).Scan(&user.id, &user.name, &user.password, &user.birthday, &user.bio, &user.created_at, &user.updated_at)
	if err != nil {
		return user, err
	}

	return user, err
}
