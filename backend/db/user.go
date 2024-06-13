package db

func GetUserByName(name string) (User, error) {
	var user User
	sql := "SELECT * FROM users WHERE name = ?;"
	err := DB.QueryRow(sql, name).Scan(&user.Id, &user.Name, &user.Password, &user.Birthday, &user.Bio, &user.CreatedAt, &user.UpdatedAt)
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

	_, err = ins.Exec(user.Name, user.Password, user.Birthday, user.Bio, user.CreatedAt, user.UpdatedAt)
	if err != nil {
		return err
	}

	return err
}
