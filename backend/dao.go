package main

import (
	"database/sql"
	"encoding/base64"
	"time"

	"github.com/go-sql-driver/mysql"
)

type User struct {
	id         string
	name       string
	enc        string
	birthday   string
	bio        string
	created_at string
	updated_at string
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

// DB初期化
func InitDB() error {
	db, err := connectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	// テーブル作成
	sql := `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
			name VARCHAR(15) NOT NULL,
			password VARCHAR(255) NOT NULL,
			birthday DATE,
			bio VARCHAR(200) NOT NULL,
			created_at TIMESTAMP NOT NULL,
			updated_at TIMESTAMP NOT NULL
		);
	`

	_, err = db.Exec(sql)
	if err != nil {
		return err
	}

	// テストユーザー作成
	password := []byte("testuser")
	enc := base64.StdEncoding.EncodeToString(password)
	time := time.Now().Format(time.DateTime)

	user := User{
		"1",
		"testuser",
		enc,
		"null",
		"null",
		time,
		time,
	}

	err = CreateTestUser(user)
	return err
}

// テストユーザー作成
func CreateTestUser(user User) error {
	db, err := connectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	sql := "INSERT IGNORE INTO users VALUES (?,?,?,?,?,?,?);"

	_, err = db.Exec(sql, user.id, user.name, user.enc, user.birthday, user.bio, user.created_at, user.updated_at)
	return err
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
	err = db.QueryRow(sql, name).Scan(&user.id, &user.name, &user.enc, &user.birthday, &user.bio, &user.created_at, &user.updated_at)
	if err != nil {
		return user, err
	}

	return user, err
}
