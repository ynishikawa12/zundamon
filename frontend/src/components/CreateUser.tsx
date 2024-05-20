import { useCallback, useState } from "react";
import axios from 'axios';
import { SERVER_URL, USER_URL } from "../consts/url";
import { useNavigate } from "react-router-dom";
import { InputUserName } from "./inputs/InputUserName";
import { InputPassword } from "./inputs/InputPassword";
import { InputBirthday } from "./inputs/InputBirthday";
import { InputBio } from "./inputs/InputBio";

export function CreateUser() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [warningUserName, setWarningUserName] = useState<boolean>(false);
    const [warningBirthday, setWarningBirthday] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const canCreate = !warningUserName && !warningBirthday && password

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

    return (
        <>
            <h3>ユーザー作成</h3>
            <InputUserName value={name} setValue={setName} warning={warningUserName} setWarning={setWarningUserName} />
            <InputPassword value={password} setValue={setPassword} />
            <InputBirthday value={birthday} setValue={setBirthday} warning={warningBirthday} setWarning={setWarningBirthday} />
            <InputBio value={bio} setValue={setBio} />
            <button onClick={useCallback(() => navigate("/"), [])}>戻る</button>
            <button disabled={!canCreate} onClick={() => sendRequest(name, password, birthday, bio)}>作成</button>
        </>
    )
}