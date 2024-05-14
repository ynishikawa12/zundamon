import { useCallback, useMemo, useState } from "react";
import { useDateSelect } from "react-ymd-date-select";
import axios from 'axios';
import { SERVER_URL, LOGIN_URL } from "../consts/url";

type User = {
    name: string;
    password: string;
    birthday: Date;
    bio: string;
}

export function CreateUser() {

    return (
        <>
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
        </>
    )
}