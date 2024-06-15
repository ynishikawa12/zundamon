import { useCallback } from "react";
import { BIO_MAX_LENGTH } from "../../consts/user";

type Props = {
    value: string;
    onChange: (value: string) => void;
}

export function InputBio({value, onChange}: Props) {
    return (
        <>
            <p>
                自己紹介（任意）：
                <textarea 
                    maxLength={BIO_MAX_LENGTH}
                    value={value}
                    onChange={useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value), [value])}
                />
            </p>
        </>
    )
}