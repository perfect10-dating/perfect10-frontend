import {useState} from "react";
import {Login} from "./Login";
import {SignUp} from "./SignUp";
import {authSlice} from "../../services/authSlice";
import {useAppSelector} from "../../app/hooks";
import {ForgotPassword} from "./ForgotPassword";
import {ResetPassword} from "./ResetPassword";

export function LandingPage() {
    const {loginPage} = useAppSelector(state => state.auth)

    switch(loginPage) {
        case "signUp":
            return <SignUp />
        case "forgotPassword":
            return <ForgotPassword />
        case "resetPassword":
            return <ResetPassword />
    }

    return <Login />
}