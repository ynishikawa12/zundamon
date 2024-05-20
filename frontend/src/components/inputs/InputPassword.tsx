import { SetStateAction, useCallback } from "react";
import { PASSWORD_MAX_LENGTH } from "../../consts/user";

type Props = {
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>
}

export function InputPassword({value, setValue}: Props) {
    return (
        <>
            <p>パスワード：
                <input 
                    type="password"
                    placeholder="パスワード"
                    maxLength={PASSWORD_MAX_LENGTH}
                    value={value}
                    onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [value])}
                />
            </p>
        </>
    )
}