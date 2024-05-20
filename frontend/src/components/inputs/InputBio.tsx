import { SetStateAction, useCallback } from "react";
import { BIO_MAX_LENGTH } from "../../consts/user";

type Props = {
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>
}

export function InputBio({value, setValue}: Props) {
    return (
        <>
            <p>
                自己紹介（任意）：
                <textarea 
                    maxLength={BIO_MAX_LENGTH}
                    value={value}
                    onChange={useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value), [value])}
                />
            </p>
        </>
    )
}