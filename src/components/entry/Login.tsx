import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useSelector} from "react-redux";
import {asyncSignIn, forgotPasswordFlowStarted, signUpFlowStarted} from "../../services/authSlice";
import {BottomActionText, Input, InputSubAction, Seperation} from "./LoginComponents";

export function Login() {
    const dispatch = useAppDispatch()
    const { status } = useAppSelector(state => state.auth)
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [phoneNumberStatus, setPhoneNumberStatus] = useState<string>('default')
    const [password, setPassword] = useState<string>('')
    const [passwordStatus, setPasswordStatus] = useState<'default' | 'entering' | 'valid'>('default')

    useEffect(() => {
        // regex from here: https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
        const newPhoneNumberStatus = phoneNumber.length === 0 ? 'default' : /^\+?[1-9]\d{1,14}$/.test(phoneNumber) ? 'valid' : 'entering'
        setPhoneNumberStatus(newPhoneNumberStatus)
    }, [phoneNumber])

    useEffect(() => {
        const newPasswordStatus = password.length === 0 ? 'default' : password.length < 8 ? 'entering' : 'valid'
        setPasswordStatus(newPasswordStatus)
    }, [password])

    useEffect(() => {
        if (status === 'failed') {
            setPhoneNumberStatus('entering')
            setPasswordStatus('entering')
        }
    }, [status])

    const handleSubmit = () => {
        dispatch(asyncSignIn({ phoneNumber: phoneNumber, password }))
    }


    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
            <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10,
            }}>
                <p style={{fontSize: 30, marginBottom: 20}}>Please Log In</p>
                {status === 'failed' && <div>Please check your username and password:</div>}
                <form autoComplete="off" spellCheck="false" style={{}}>
                    <div style={{ backgroundColor: "rgb(243,244,246)", borderRadius: 15, paddingTop: 2, paddingBottom: 2,
                        margin: "0 auto", width: 300, maxWidth: "calc(100vw - 20px)",
                    }}>
                        <Input
                            key="email"
                            status={phoneNumberStatus}
                            placeholder="Phone Number"
                            autoComplete="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.trim().toLowerCase())}
                        />
                        <Input
                            key="password"
                            status={passwordStatus}
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputSubAction onClick={() => dispatch(forgotPasswordFlowStarted())}>Forgot password?</InputSubAction>
                    </div>

                    <div style={{marginTop: 30}}>
                        <div onClick={handleSubmit}>Log In</div>
                        <Seperation>or</Seperation>
                        <BottomActionText onClick={() => dispatch(signUpFlowStarted())}>Create New Account</BottomActionText>
                    </div>
                </form>
            </div>
        </div>
    )
}