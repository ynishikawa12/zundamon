import { SetStateAction, useCallback } from "react";
import { BIRTHDAY_LENGTH, BIRTHDAY_PATTERN, WARNING_CSS } from "../../consts/user";

type Props = {
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>;
    warning: boolean;
    setWarning: React.Dispatch<SetStateAction<boolean>>
}

export function InputBirthday({value, setValue, warning, setWarning}: Props) {
    const handle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setValue(value);
        if (value.length && value.length != BIRTHDAY_LENGTH) {
            setWarning(true);
        } else {
            setWarning(false);
        }
    }, [value])
    
    return (
        <>
            {warning && <p style={WARNING_CSS}>{BIRTHDAY_LENGTH}桁の半角数字を入力してください</p>}
            <p>
                生年月日（任意）：
                <input 
                    type="text"
                    pattern="^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
                    placeholder="19900101"
                    maxLength={BIRTHDAY_LENGTH}
                    value={value}
                    onChange={handle}
                />
            </p>
        </>
    )
}