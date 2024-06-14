type Props = {
    message: string
}

export function FormErrorMessage({message}: Props) {
    return <p style={{fontSize: "10px", color: "red", margin: "0"}}>{message}</p>
}