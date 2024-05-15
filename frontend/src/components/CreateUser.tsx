import { useCallback, useState } from "react";
import axios from 'axios';
import { SERVER_URL, USER_URL } from "../consts/url";

export function CreateUser() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [bio, setBio] = useState<string>("");

    const sendRequest = useCallback((name: string, password: string, birthday: string, bio: string) => {
        const date = new Date(Number(birthday.substring(0, 4)), Number(birthday.substring(4, 6)) - 1, Number(birthday.substring(6, 8)))
        console.log(date.toISOString())
        const user = {
            Name: name,
            Password: password,
            Birthday: birthday === "" ? null : {V: date.toISOString(), Valid: true},
            Bio: bio,
        }

        axios.post((SERVER_URL + USER_URL), user)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [name,password, birthday, bio])

    return (
        <>
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
            <p>
                生年月日（任意）：
                <input 
                    type="text"
                    placeholder="19900101"
                    maxLength={8}
                    value={birthday}
                    onChange={(e) => setBirthday((e.target.value.replace(/[^0-9]/g, '')))}
                />
            </p>
            <p>
                自己紹介：
                <textarea 
                    maxLength={200}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </p>
            <button onClick={() => sendRequest(name, password, birthday, bio)}>作成</button>
        </>
    )
}