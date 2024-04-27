import { useState } from "react";
import axios from 'axios';
import { LOCAL_URL, LOGIN_URL } from "../utils/url";

const Login = () => {
    const [userName, setUserName] = useState<string>();
    const [password, setPassowrd] = useState<string>();
    const [loginFailed, setLoginFailed] = useState<boolean>(false);

    function login(name: string, password: string) {
        const encodedName = btoa(unescape(encodeURIComponent(name)));
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
            setUserName("");
            setPassowrd("");
        })
    }

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
            {userName === undefined || userName === "" || password === undefined || password === "" ? (
                <button disabled>ログイン</button>
            ) : (
                <button type="submit" onClick={() => login(userName, password)}>ログイン</button>
            )}
            
        </>
    )
}

export {Login};