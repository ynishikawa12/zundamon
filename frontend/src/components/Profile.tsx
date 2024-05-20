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
    id: number;
    name: string;
    password: string;
    birthday: string;
    bio: string;
}

interface PatchUser {
    [prop: string]: any;
}

export function Profile({loginedUserName}: Props) {
    const [currentUser, setCurrentUser] = useState<User>({id: 0, name: "", password: "", birthday: "", bio: ""})
    const [id, setId] = useState<number>();
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
                setId(response.data.id);
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
                    id: response.data.id,
                    name: response.data.name,
                    password: "",
                    birthday: stringBirthday,
                    bio: response.data.bio.V,
                })
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [name]);

    const sendPatchRequest = useCallback(() => {
        const user: PatchUser = {}
        user.Id = id;
        if (currentUser.name !== name) {
            user.Name = name;
        }
        if (password) {
            user.Password = password;
        }
        if (currentUser.birthday != birthday) {
            if (birthday) {
                console.log(1)
                const date = new Date(Number(birthday.substring(0, 4)), Number(birthday.substring(4, 6)) - 1, Number(birthday.substring(6, 8)))
                user.Birthday = {V: date.toISOString(), Valid: true}
            } else {
                console.log(2, user.birthday)
                user.Birthday = {V: null, Valid: true};
            }
        }
        if (currentUser.bio != bio) {
            user.Bio = {V: bio, Valid: true};
        }
        
        const userJson = JSON.stringify(user);
        axios.patch((SERVER_URL + USER_URL), userJson)
            .then(function (response) {
                alert("ユーザーを更新しました")
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [name, password, birthday, bio]);

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
            <button disabled={warningName || warningBirthday} onClick={sendPatchRequest}>更新</button>
        </>
    )
}