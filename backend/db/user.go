package db

import "strconv"

func GetUserByName(name string) (User, error) {
	var user User
	sql := "SELECT * FROM users WHERE name = ?;"
	err := DB.QueryRow(sql, name).Scan(&user.Id, &user.Name, &user.Password, &user.Birthday, &user.Bio, &user.Created_at, &user.Updated_at)
	if err != nil {
		return user, err
	}

	return user, err
}

func CreateUser(user User) error {
	sql := "INSERT INTO users (name, password, birthday, bio, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)"
	ins, err := DB.Prepare(sql)
	if err != nil {
		return err
	}

	_, err = ins.Exec(user.Name, user.Password, user.Birthday, user.Bio, user.Created_at, user.Updated_at)
	if err != nil {
		return err
	}

	return nil
}

func PatchUser(id int, patchMap map[string]any) error {
	columns := []string{}
	values := []any{}
	for k, v := range patchMap {
		columns = append(columns, k)
		values = append(values, v)
	}
	values = append(values, strconv.Itoa(id))

	var updateColumns string
	for i, v := range columns {
		updateColumns += v + " = ?"
		if i == len(columns)-1 {
			break
		}
		updateColumns += ", "
	}

	sql := "UPDATE users SET " + updateColumns + " WHERE id = ?"
	upd, err := DB.Prepare(sql)
	if err != nil {
		return err
	}

	_, err = upd.Exec(values...)
	if err != nil {
		return err
	}

	return nil
}
