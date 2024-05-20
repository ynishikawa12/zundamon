import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { SERVER_URL, USER_URL } from "../consts/url";
import { useNavigate } from "react-router-dom";
import { InputUserName } from "./inputs/InputUserName";
import { InputPassword } from "./inputs/InputPassword";
import { InputBirthday } from "./inputs/InputBirthday";
import { InputBio } from "./inputs/InputBio";

type Props = {
    loginedUserName: string;
}

type User = {
    name: string;
    password: string;
    birthday: string;
    bio: string;
}

export function Profile({loginedUserName}: Props) {
    const [currentUser, setCurrentUser] = useState<User>();
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [warningName, setWarningName] = useState<boolean>(false);
    const [warningBirthday, setWarningBirthday] = useState<boolean>(false);
    const [canEditName, setCanEditName] = useState<boolean>(false);
    const [canEditPassword, setCanEditPassword] = useState<boolean>(false);
    const [canEditBirthday, setCanEditBirthday] = useState<boolean>(false);
    const [canEditBio, setCanEditBio] = useState<boolean>(false);

    const navigate = useNavigate();

    const sendGetRequest = useCallback((userName: string) => {
        console.log(SERVER_URL + USER_URL + "/" + userName)
        axios.get((SERVER_URL + USER_URL + "/" + userName))
            .then(function (response) {
                setName(response.data.name);
                setPassword(response.data.password);
                setBio(response.data.bio.V);

                let stringBirthday = "";
                if (response.data.birthday.Valid) {
                    stringBirthday = new Date(response.data.birthday.V).toLocaleDateString().replace("/", "").replace("/", "")
                    setBirthday(stringBirthday);
                } else {
                    setBirthday(stringBirthday);
                }

                setCurrentUser({
                    name: response.data.name,
                    password: response.data.password,
                    birthday: stringBirthday,
                    bio: response.data.bio.V,
                })
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [name]);

    const sendPatchRequest = useCallback(() => {

    }, [loginedUserName, password, birthday, bio]);

    // 編集ボタン
    const EditButton = useCallback((setState: React.Dispatch<SetStateAction<boolean>>, disabled: boolean) => {
        return <button disabled={disabled} onClick={() => setState((bool) => !bool)}><img src="src/assets/pencil.svg" height={20} width={20} alt="edit" /></button>
    },[])

    const DisplayUser = useMemo(() => {
        return (canEditName ? 
            <InputUserName value={name} setValue={setName} warning={warningName} setWarning={setWarningName} /> :
            <>ユーザー名：{name}</>
        )
    }, [canEditName, name])

    const DisplayPassword = useMemo(() => {
        return (canEditPassword ?
            <InputPassword value={password} setValue={setPassword} /> :
            <>パスワード：{password}</>
        )
    }, [canEditPassword, password])

    const DisplayBirthday = useMemo(() => {
        return (canEditBirthday ?
            <InputBirthday value={birthday} setValue={setBirthday} warning={warningBirthday} setWarning={setWarningBirthday}/> :
            <>生年月日（任意）：{birthday}</>
        )
    }, [canEditBirthday, birthday])

    const DisplayBio = useMemo(() => {
        return (canEditBio ?
            <InputBio value={bio} setValue={setBio} /> :
            <>自己紹介（任意）：{bio}</>
        )
    }, [canEditBio, bio])

    useEffect(() => sendGetRequest(loginedUserName), [loginedUserName])

    return (
        <>
            <h3>プロフィール</h3>
            <div>
                {DisplayUser}
                {EditButton(setCanEditName, canEditName && warningName)}
            </div>
            <div>
                {DisplayPassword}
                {EditButton(setCanEditPassword, canEditPassword && false)}
            </div>
            <div>
                {DisplayBirthday}
                {EditButton(setCanEditBirthday, canEditBirthday && warningBirthday)}
            </div>
            <div>
                {DisplayBio}
                {EditButton(setCanEditBio, false)}
            </div>
            <button onClick={useCallback(() => navigate("/"), [])}>戻る</button>
            <button disabled={warningName || warningBirthday}>更新</button>
        </>
    )
}