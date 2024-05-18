import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { SERVER_URL, USER_URL } from "../consts/url";
import { useNavigate } from "react-router-dom";

export function CreateUser() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [warningBirthday, setWarningBirthday] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const nameMaxLen = 15;
    const passwordMaxLen = 10;
    const birthdayLen = 8;
    const bioMaxLen = 200;


    useEffect(() => {
        if (birthday.length != birthdayLen) {
            setWarningBirthday(true);
        } else {
            setWarningBirthday(false);
        }
    }, [birthday])

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
                console.log(response)
                alert("ユーザーを作成しました")
                navigate("/")
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [name,password, birthday, bio])

    const userNameFilter = "^[a-zA-Z0-9]+$"
    const filterUserName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value.match(userNameFilter) || value == "") {
            setName(value)
        }
    }, [name])

    const birthdayFilter = "^[0-9]+$"
    const filterBirthday = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value.match(birthdayFilter) || value == "") {
            setBirthday(value)
        }
    }, [birthday])

    return (
        <>
            <h3>ユーザー作成</h3>
            <p>ユーザー名：
                <input 
                    type="text"
                    placeholder="ユーザー名"
                    maxLength={nameMaxLen}
                    value={name}
                    onChange={filterUserName}
                />
            </p>
            <p>パスワード：
                <input 
                    type="password"
                    placeholder="パスワード"
                    maxLength={passwordMaxLen}
                    value={password}
                    onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), [password])}
                />
            </p>
            {warningBirthday && <p style={{fontSize: "10px", color: "red", margin: "0"}}>8桁を入力してください</p>}
            <p>
                生年月日（任意）：
                <input 
                    type="text"
                    placeholder="19900101"
                    maxLength={birthdayLen}
                    value={birthday}
                    onChange={filterBirthday}
                />
            </p>
            <p>
                自己紹介：
                <textarea 
                    maxLength={bioMaxLen}
                    value={bio}
                    onChange={useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value), [bio])}
                />
            </p>
            <button onClick={useCallback(() => navigate("/"), [])}>戻る</button>
            <button onClick={() => sendRequest(name, password, birthday, bio)}>作成</button>
        </>
    )
}