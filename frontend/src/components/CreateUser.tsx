import { useCallback, useState } from "react";
import axios from 'axios';
import { SERVER_URL, USER_URL } from "../consts/url";
import { useNavigate } from "react-router-dom";
import { InputUserName } from "./inputs/InputUserName";
import { InputPassword } from "./inputs/InputPassword";
import { InputBirthday } from "./inputs/InputBirthday";
import { InputBio } from "./inputs/InputBio";

interface User {
    Name: string,
    Password: string,
    Bio?: string,
    Birthday?: Date,
}

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
        const user: User = {
            Name: name,
            Password: password,
        }
        if (bio) {
            user.Bio = bio;
        }
        if (birthday) {
            const date = Date.parse(birthday);
            user.Birthday = new Date(date)
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

    const handlePushBack = useCallback(() => navigate("/"), [])
    const handleSendRequest = useCallback(() => sendRequest(name, password, birthday, bio), [name, password, birthday, bio])

    return (
        <>
            <h3>ユーザー作成</h3>
            <InputUserName value={name} onChange={setName} warning={showUserNameErrorMessage} handleSetWarning={setShowUserNameErrorMessage} />
            <InputPassword value={password} onChange={setPassword} />
            <InputBirthday value={birthday} onChange={setBirthday} warning={showBirthdayErrorMessage} handleSetWarning={setShowBirthdayErrorMessage} />
            <InputBio value={bio} onChange={setBio} />
            <button onClick={handlePushBack}>戻る</button>
            <button disabled={!canCreate} onClick={handleSendRequest}>作成</button>
        </>
    )
}