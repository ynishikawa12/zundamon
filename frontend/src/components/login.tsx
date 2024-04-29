import { useCallback, useState } from "react";
import axios from 'axios';
import { LOCAL_URL, LOGIN_URL } from "../consts/url";

type LoginInfo = {
    userName: string | undefined;
    password: string | undefined;
}

function Login () {
    const [userName, setUserName] = useState<string>();
    const [password, setPassowrd] = useState<string>();
    const [loginFailed, setLoginFailed] = useState<boolean>(false);

    
    const LoginButton = useCallback(({userName, password}: LoginInfo) => {
        if (userName != undefined && userName != "" && password != undefined && password != "") {
            return <button type="submit" onClick={() => login(userName, password)}>ログイン</button>
        } else {
            return <button disabled>ログイン</button>
        }
    },[userName, password])

    const login = useCallback((userName: string, password: string) => {
        const encodedName = btoa(unescape(encodeURIComponent(userName)));
        const encodedPassowrd = btoa(unescape(encodeURIComponent(password)));

        const headers = {
            "Authorization": encodedName + ":" + encodedPassowrd
        }

        axios.post((LOCAL_URL + LOGIN_URL), {headers: headers})
        .then(function (response) {
            if (response.status === 204) {
                // TODO
            }
        })
        .catch(function (error) {
            setLoginFailed(true);
        })
    },[userName, password])

    return (
        <>
            {loginFailed && <p style={{color: "red"}}>ログインに失敗しました</p>}
            <p>ユーザー名：
                <input 
                    type="text"
                    placeholder="ユーザー名"
                    maxLength={15}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />  
            </p>
            <p>パスワード：
                <input 
                    type="password"
                    placeholder="パスワード"
                    maxLength={10}
                    value={password}
                    onChange={(e) => setPassowrd(e.target.value)}
                /> 
            </p>
            <LoginButton userName={userName} password={password}/>
        </>
    )
}

export {Login};