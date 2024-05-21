import { useCallback, useState } from "react";
import axios from 'axios';
import { SERVER_URL, USER_URL } from "../consts/url";
import { useNavigate } from "react-router-dom";
import { USER_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, BIRTHDAY_LENGTH, BIO_MAX_LENGTH, USER_NAME_PATTERN, BIRTHDAY_PATTERN } from "../consts/user";
import { FormErrorMessage } from "./forms/FormErrorMessage";

export function CreateUser() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [showUserNameErrorMessage, setShowUserNameErrorMessage] = useState<boolean>(false);
    const [showBirthdayErrorMessage, setShowBirthdayErrorMessage] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const canCreate = !showUserNameErrorMessage && !showBirthdayErrorMessage && password

    const sendRequest = useCallback((name: string, password: string, birthday: string, bio: string) => {
        const date = new Date(Number(birthday.substring(0, 4)), Number(birthday.substring(4, 6)) - 1, Number(birthday.substring(6, 8)))
        const user = {
            Name: name,
            Password: password,
            Birthday: birthday === "" ? null : {V: date.toISOString(), Valid: true},
            Bio: bio === "" ? null : {V: bio, Valid: true},
        }

        axios.post((SERVER_URL + USER_URL), user)
            .then(function (response) {
                alert("ユーザーを作成しました")
                navigate("/")
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [name,password, birthday, bio])

    const handleUserName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (!value || !USER_NAME_PATTERN.test(value)) {
            setShowUserNameErrorMessage(true);
        } else {
            setShowUserNameErrorMessage(false);
        }
        setName(value)
    }, [name])

    const handleBirthday = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (!value || BIRTHDAY_PATTERN.test(value)) {
            setBirthday(value)
        }

        if (value.length && value.length != BIRTHDAY_LENGTH) {
            setShowBirthdayErrorMessage(true);
        } else {
            setShowBirthdayErrorMessage(false);
        }
    }, [birthday])

    return (
        <>
            <h3>ユーザー作成</h3>
            {showUserNameErrorMessage && <FormErrorMessage message={USER_NAME_MAX_LENGTH + "以下で入力してください"}/>}
            <p>ユーザー名：
                <input 
                    type="text"
                    placeholder="ユーザー名"
                    maxLength={USER_NAME_MAX_LENGTH}
                    value={name}
                    onChange={handleUserName}
                />
            </p>
            <p>パスワード：
                <input 
                    type="password"
                    placeholder="パスワード"
                    maxLength={PASSWORD_MAX_LENGTH}
                    value={password}
                    onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), [password])}
                />
            </p>
            {showBirthdayErrorMessage && <FormErrorMessage message={BIRTHDAY_LENGTH + "桁の半角数字を入力してください"} />}
            <p>
                生年月日（任意）：
                <input 
                    type="text"
                    placeholder="19900101"
                    maxLength={BIRTHDAY_LENGTH}
                    value={birthday}
                    onChange={handleBirthday}
                />
            </p>
            <p>
                自己紹介（任意）：
                <textarea 
                    maxLength={BIO_MAX_LENGTH}
                    value={bio}
                    onChange={useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value), [bio])}
                />
            </p>
            <button onClick={useCallback(() => navigate("/"), [])}>戻る</button>
            <button disabled={!canCreate} onClick={() => sendRequest(name, password, birthday, bio)}>作成</button>
        </>
    )
}