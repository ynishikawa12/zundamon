package db

// 名前からユーザー取得
func GetUser(name string) (User, error) {
	var user User
	sql := "SELECT * FROM users WHERE name = ?;"
	err := sqlDB.QueryRow(sql, name).Scan(&user.Id, &user.Name, &user.Password, &user.Birthday, &user.Bio, &user.Created_at, &user.Updated_at)
	if err != nil {
		return user, err
	}

	return user, err
}

// ユーザー作成
func CreateUser(user User) error {
	sql := "INSERT INTO users (name, password, birthday, bio, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)"
	ins, err := sqlDB.Prepare(sql)
	if err != nil {
		return err
	}

	ins.Exec(user.Name, user.Password, user.Birthday, user.Bio, user.Created_at, user.Updated_at)

	return err
}
