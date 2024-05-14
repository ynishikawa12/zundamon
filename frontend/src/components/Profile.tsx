import { useCallback, useState } from "react";
import axios from 'axios';
import { SERVER_URL, LOGIN_URL, USER_URL } from "../consts/url";

type User = {
    name: string;
    birthday: string;
    bio: string;
}

export function Profile(name: string) {
    const [user, setUser] = useState<User>();

    const sendRequest = useCallback((name: string) => {
        axios.get((SERVER_URL + USER_URL + "/" + name))
            .then(function (response) {
                console.log(response.data.name);
                setUser({
                    name: response.data.name,
                    birthday: response.data.birthday,
                    bio: response.data.bio,
                })
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [name])

    sendRequest(name)

    return (
        <>
            <p>
                ユーザー名：<input type="text" />
            </p>
        </>
    )
}