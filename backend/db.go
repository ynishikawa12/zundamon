package main

import (
	"database/sql"
	"time"

	"github.com/go-sql-driver/mysql"
)

type User struct {
	Id         int                 `json:"id"`
	Name       string              `json:"name"`
	Password   string              `json:"password"`
	Birthday   sql.Null[time.Time] `json:"birthday"`
	Bio        string              `json:"bio"`
	Created_at time.Time           `json:"created_at"`
	Updated_at time.Time           `json:"updated_at"`
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
	err = db.QueryRow(sql, name).Scan(&user.Id, &user.Name, &user.Password, &user.Birthday, &user.Bio, &user.Created_at, &user.Updated_at)
	if err != nil {
		return user, err
	}

	return user, err
}

// ユーザー作成
func CreateUser(user User) error {
	db, err := connectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	sql := "INSERT INTO users (name, password, birthday, bio, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)"
	ins, err := db.Prepare(sql)
	if err != nil {
		return err
	}

	ins.Exec(user.Name, user.Password, user.Birthday, user.Bio, user.Created_at, user.Updated_at)

	return err
}
