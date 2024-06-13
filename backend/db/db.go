package db

import (
	"database/sql"
<<<<<<< HEAD
=======
	"log"
>>>>>>> origin/master
	"time"

	"github.com/go-sql-driver/mysql"
)

type User struct {
	Id         int                 `json:"id"`
	Name       string              `json:"name"`
	Password   string              `json:"password"`
	Birthday   sql.Null[time.Time] `json:"birthday"`
<<<<<<< HEAD
	Bio        sql.Null[string]    `json:"bio"`
=======
	Bio        string              `json:"bio"`
>>>>>>> origin/master
	Created_at time.Time           `json:"created_at"`
	Updated_at time.Time           `json:"updated_at"`
}

<<<<<<< HEAD
var DB *sql.DB

func InitDB() error {
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		return err
=======
var sqlDB *sql.DB

func ConnectDB() (db *sql.DB, err error) {
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		return db, err
>>>>>>> origin/master
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

<<<<<<< HEAD
	var error error
	DB, error = sql.Open("mysql", c.FormatDSN())
	if error != nil {
		return error
	}

	return nil
=======
	db, err = sql.Open("mysql", c.FormatDSN())
	if err != nil {
		return db, err
	}

	return db, err
}

func InitDB() {
	var err error
	sqlDB, err = ConnectDB()
	if err != nil {
		log.Fatal(err)
	}
}

func GetDB() (db *sql.DB) {
	return sqlDB
>>>>>>> origin/master
}
