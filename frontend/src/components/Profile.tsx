import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { SERVER_URL, USER_URL } from "../consts/url";

type Props = {
    userName: string;
}

type User = {
    name: string;
    password: string;
    birthday: string;
    bio: string;
}

export function Profile({userName}: Props) {
    const [currentUser, setCurrentUser] = useState<User>();
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [editName, setEditName] = useState<boolean>(false);
    const [editPassword, setEditPassword] = useState<boolean>(false);
    const [editBirthday, setEditBirthday] = useState<boolean>(false);
    const [editBio, setEditBio] = useState<boolean>(false);

    const sendGetRequest = useCallback((userName: string) => {
        console.log(SERVER_URL + USER_URL + "/" + userName)
        axios.get((SERVER_URL + USER_URL + "/" + userName))
            .then(function (response) {
                setName(response.data.name);
                setPassword(response.data.password);
                setBio(response.data.bio);

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
                    bio: response.data.bio,
                })
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [userName]);

    const sendPatchRequest = useCallback(() => {

    }, [userName, password, birthday, bio]);

    // 編集ボタン
    const editButton = useCallback((setState: React.Dispatch<SetStateAction<boolean>>) => {
        return <button onClick={() => setState((bool) => !bool)}><img src="src/assets/pencil.svg" height={20} width={20} alt="edit" /></button>
    },[])

    const displayUser = useMemo(() => {
        return (editName ? 
            <input 
            type="text"
            placeholder="ユーザー名"
            maxLength={15}
            value={name}
            onChange={(e) => setName(e.target.value)}
            /> :
            <>{name}</>
        )
    }, [editName, name])

    const displayPassword = useMemo(() => {
        return (editPassword ?
            <input 
                type="password"
                placeholder="パスワード"
                maxLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /> :
            <>
                {password === "" ? "****" : password} 
            </>
        )
    }, [editPassword, password])

    const displayBirthday = useMemo(() => {
        return (editBirthday || birthday === "" ?
            <input 
                type="text"
                placeholder="19900101"
                maxLength={8}
                value={birthday}
                onChange={(e) => setBirthday((e.target.value.replace(/[^0-9]/g, '')))}
            /> :
            <>{birthday}</>
        )
    }, [editBirthday, birthday])

    const displayBio = useMemo(() => {
        return (editBio ?
            <textarea 
                maxLength={200}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            /> :
            <>{bio}</>
        )
    }, [editBio, bio])

    // ログインユーザーが変わったらプロフィール更新
    useEffect(() => sendGetRequest(userName), [userName])

    return (
        <>
            <h3>プロフィール</h3>
            <div>ユーザー名：
                {displayUser}
                {editButton(setEditName)}
            </div>
            <div>パスワード：
                {displayPassword}
                {editButton(setEditPassword)}
            </div>
            <div>生年月日（任意）：
                {displayBirthday}
                {editButton(setEditBirthday)}
            </div>
            <div>自己紹介：
                {displayBio}
                {editButton(setEditBio)}
            </div>
            <div><button>戻る</button><button>更新</button></div>
        </>
    )
}