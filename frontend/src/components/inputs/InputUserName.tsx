import { SetStateAction, useCallback } from "react";
import { USER_NAME_MAX_LENGTH, USER_NAME_PATTERN, WARNING_CSS } from "../../consts/user";

type Props = {
    value: string;
    onChange: (value: string) => void;
    warning: boolean;
    handleSetWarning: React.Dispatch<SetStateAction<boolean>>
}

export function InputUserName({value, onChange, warning, handleSetWarning: setWarning}: Props) {
    const handle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (!value || !USER_NAME_PATTERN.test(value)) {
            setWarning(true);
        } else {
            setWarning(false);
        }
        onChange(value)
    }, [value])

    return (
        <>
            {warning && <p style={WARNING_CSS}>半角英数字/{USER_NAME_MAX_LENGTH}文字以下で入力してください</p>}
            <p>ユーザー名：
                <input 
                    type="text"
                    placeholder="ユーザー名"
                    maxLength={USER_NAME_MAX_LENGTH}
                    value={value}
                    onChange={handle}
                />
            </p>
        </>
    )
}

