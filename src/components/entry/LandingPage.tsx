import {useState} from "react";
import {Login} from "./Login";
import {Create} from "./Create";

export function LandingPage() {
    const [isCreatingAccount, setIsCreatingAccount] = useState(false)

    if (isCreatingAccount) {
        return <Login />
    } else {
        return <Create />
    }
}