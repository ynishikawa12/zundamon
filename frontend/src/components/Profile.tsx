export function Profile() {
    const sendRequest = (name: string, password: string, birthday: string, bio: string) => {
        const user = {
            Name: name,
            Password: password,
            Birthday: birthday === "" ? null : birthday,
            Bio: bio,
        }

        axios.post((SERVER_URL + USER_URL), user)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            })
    }
}