import { useCallback, useMemo, useState } from "react";
import axios from 'axios';
import { SERVER_URL, LOGIN_URL } from "../consts/url";
import { useNavigate } from "react-router-dom";

export function Login () {
    const [userName, setUserName] = useState<string>();
    const [password, setPassowrd] = useState<string>();
    const [loginFailed, setLoginFailed] = useState<boolean>(false);
    const navigate = useNavigate()
    
    const LoginButton = useMemo(() => {
        const canSubmit = userName && password;
        if (canSubmit) {
            return <button type="submit" onClick={() => login(userName, password)}>ログイン</button>
        } else {
            return <button disabled>ログイン</button>
        }
    },[userName, password])

    const login = useCallback((userName: string, password: string) => {
        const encoded = btoa(unescape(encodeURIComponent(userName + ":" + password)));
        const headers = {
            Authorization: encoded
        }

        axios.post((SERVER_URL + LOGIN_URL), {}, {headers: headers})
        .then(function (response) {
            if (response.status === 204) {
                // TODO 音声合成画面へ遷移
                setLoginFailed(false);
                alert("ログイン成功");
            } else if (response.status != 204) {
                console.log("not 204", response.data);
            }
        })
        .catch(function (error) {
            setLoginFailed(true);
        })
    },[userName, password])

    const userNameFilter = "^[a-zA-Z0-9]+$"
    const filterUserName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value.match(userNameFilter) || value == "") {
            setUserName(value)
        }
    }, [name])

    return (
        <>
            <h3>ログイン</h3>
            {loginFailed && <p style={{color: "red"}}>ログインに失敗しました</p>}
            <p>ユーザー名：
                <input 
                    type="text"
                    placeholder="ユーザー名"
                    maxLength={15}
                    value={userName}
                    onChange={filterUserName}
                />  
            </p>
            <p>パスワード：
                <input 
                    type="password"
                    placeholder="パスワード"
                    maxLength={10}
                    value={password}
                    onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPassowrd(e.target.value), [password])}
                /> 
            </p>
            {LoginButton}
            <button onClick={useCallback(() => navigate("/createUser"), [])}>ユーザー作成</button>
        </>
    )
}