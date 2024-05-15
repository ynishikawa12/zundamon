import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { SERVER_URL, LOGIN_URL, USER_URL } from "../consts/url";

type Props = {
    username: string;
}

type User = {
    name: string;
    birthday: string;
    bio: string;
}

export function Profile({username}: Props) {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [bio, setBio] = useState<string>("");

    const sendRequest = useCallback((username: string) => {
        console.log(SERVER_URL + USER_URL + "/" + username)
        axios.get((SERVER_URL + USER_URL + "/" + username))
            .then(function (response) {
                console.log(response.data.name);
                setName(response.data.name);
                setPassword(response.data.password);
                setBirthday(response.data.birthday);
                setBio(response.data.bio);
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [username])

    useEffect(() => sendRequest(username), [username])

    return (
        <>
            <h3>プロフィール</h3>
            <p>ユーザー名：
                <input 
                    type="text"
                    placeholder="ユーザー名"
                    maxLength={15}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </p>
            <p>パスワード：
                <input 
                    type="password"
                    placeholder="パスワード"
                    maxLength={10}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /> 
            </p>
            <p>生年月日（任意）：
                <input 
                    type="text"
                    placeholder="19900101"
                    maxLength={8}
                    value={birthday}
                    onChange={(e) => setBirthday((e.target.value.replace(/[^0-9]/g, '')))}
                />
            </p>
            <p>自己紹介：
                <textarea 
                    maxLength={200}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </p>
        </>
    )
}