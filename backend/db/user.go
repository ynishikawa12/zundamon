package db

import (
	"fmt"
	"strings"
)

func GetUserById(id int) (UserInfo, error) {
	var user UserInfo
	sql := "SELECT * FROM users WHERE id = ?;"
	err := DB.QueryRow(sql, id).Scan(&user.Id, &user.Name, &user.Password, &user.Birthday, &user.Bio, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return user, err
	}

	return user, err
}

func GetUserByName(name string) (UserInfo, error) {
	var user UserInfo
	sql := "SELECT * FROM users WHERE name = ?;"
	err := DB.QueryRow(sql, name).Scan(&user.Id, &user.Name, &user.Password, &user.Birthday, &user.Bio, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return user, err
	}

	return user, err
}

func CreateUser(user UserInfo) error {
	sql := "INSERT INTO users (name, password, birthday, bio, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)"
	ins, err := DB.Prepare(sql)
	if err != nil {
		return err
	}

	_, err = ins.Exec(user.Name, user.Password, user.Birthday, user.Bio, user.CreatedAt, user.UpdatedAt)
	if err != nil {
		return err
	}

	return nil
}

func UpdateUser(updateUser UpdateUserInfo) error {
	baseSQL := "UPDATE users SET %s WHERE id = ?"
	var columns []string
	var values []any

	if updateUser.Name != nil {
		columns = append(columns, "name = ?")
		values = append(values, *updateUser.Name)
	}

	if updateUser.Password != nil {
		columns = append(columns, "password = ?")
		values = append(values, *updateUser.Bio)
	}

	if updateUser.Birthday != nil {
		columns = append(columns, "birthday = ?")
		values = append(values, *updateUser.Birthday)
	}

	if updateUser.Bio != nil {
		columns = append(columns, "bio = ?")
		values = append(values, *updateUser.Bio)
	}

	values = append(values, updateUser.Id)

	query := fmt.Sprintf(baseSQL, strings.Join(columns, ", "))

	fmt.Println("query", query)

	stmt, err := DB.Prepare(query)
	if err != nil {
		return err
	}

	if _, err := stmt.Exec(values...); err != nil {
		return err
	}

	return nil
}
