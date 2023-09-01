import {useState} from "react";
import {Login} from "./Login";
import {SignUp} from "./SignUp";
import {authSlice} from "../../services/authSlice";
import {useAppSelector} from "../../app/hooks";
import {ForgotPassword} from "./ForgotPassword";
import {ResetPassword} from "./ResetPassword";

interface PropTypes {
    referringUser?: string
    qrCode?: string
}

export function LandingPage(props: PropTypes) {
    const {loginPage} = useAppSelector(state => state.auth)

    switch(loginPage) {
        case "signUp":
            return <SignUp referringUser={props.referringUser} qrCode={props.qrCode} />
        case "forgotPassword":
            return <ForgotPassword />
        case "resetPassword":
            return <ResetPassword />
    }

    return <Login />
}