package db

<<<<<<< HEAD
func GetUserByName(name string) (User, error) {
	var user User
	sql := "SELECT * FROM users WHERE name = ?;"
	err := DB.QueryRow(sql, name).Scan(&user.Id, &user.Name, &user.Password, &user.Birthday, &user.Bio, &user.Created_at, &user.Updated_at)
=======
// 名前からユーザー取得
func GetUser(name string) (User, error) {
	var user User
	sql := "SELECT * FROM users WHERE name = ?;"
	err := sqlDB.QueryRow(sql, name).Scan(&user.Id, &user.Name, &user.Password, &user.Birthday, &user.Bio, &user.Created_at, &user.Updated_at)
>>>>>>> origin/master
	if err != nil {
		return user, err
	}

	return user, err
}

<<<<<<< HEAD
func CreateUser(user User) error {
	sql := "INSERT INTO users (name, password, birthday, bio, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)"
	ins, err := DB.Prepare(sql)
=======
// ユーザー作成
func CreateUser(user User) error {
	sql := "INSERT INTO users (name, password, birthday, bio, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)"
	ins, err := sqlDB.Prepare(sql)
>>>>>>> origin/master
	if err != nil {
		return err
	}

<<<<<<< HEAD
	_, err = ins.Exec(user.Name, user.Password, user.Birthday, user.Bio, user.Created_at, user.Updated_at)
	if err != nil {
		return err
	}
=======
	ins.Exec(user.Name, user.Password, user.Birthday, user.Bio, user.Created_at, user.Updated_at)
>>>>>>> origin/master

	return err
}
