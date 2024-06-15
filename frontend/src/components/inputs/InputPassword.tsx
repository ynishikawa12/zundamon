import { useCallback } from "react";
import { PASSWORD_MAX_LENGTH } from "../../consts/user";

type Props = {
    value: string;
    onChange: (value: string) => void;
}

export function InputPassword({value, onChange}: Props) {
    return (
        <>
            <p>パスワード：
                <input 
                    type="password"
                    placeholder="パスワード"
                    maxLength={PASSWORD_MAX_LENGTH}
                    value={value}
                    onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value), [value])}
                />
            </p>
        </>
    )
}