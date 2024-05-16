import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { SERVER_URL, USER_URL } from "../consts/url";

type Props = {
    username: string;
}

export function Profile({username}: Props) {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [editName, setEditName] = useState<boolean>(false);
    const [editPassword, setEditPassword] = useState<boolean>(false);
    const [editBirthday, setEditBirthday] = useState<boolean>(false);
    const [editBio, setEditBio] = useState<boolean>(false);

    // APIにGETリクエスト
    const sendGetRequest = useCallback((username: string) => {
        console.log(SERVER_URL + USER_URL + "/" + username)
        axios.get((SERVER_URL + USER_URL + "/" + username))
            .then(function (response) {
                console.log(response.data);
                setName(response.data.name);
                setPassword(response.data.password);
                setBio(response.data.bio);

                if (response.data.birthday.Valid) {
                    setBirthday(new Date(response.data.birthday.V).toLocaleDateString().replace("/", "").replace("/", ""));
                } else {
                    setBirthday("");
                }
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [username])

    // APIにPATCHリクエスト
    

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
            <>****</>
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
    useEffect(() => sendGetRequest(username), [username])

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