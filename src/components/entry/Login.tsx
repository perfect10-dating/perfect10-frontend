import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useSelector} from "react-redux";
import {asyncSignIn, forgotPasswordFlowStarted, signUpFlowStarted} from "../../services/authSlice";
import {BottomActionText, Input, InputSubAction, Seperation} from "./LoginComponents";
import {LoadingWrapper} from "../misc/LoadingWrapper";
import {useLazyDoesPhoneNumberExistQuery} from "../../services/api";

export function Login() {
    const dispatch = useAppDispatch()
    const [doesNumberExist] = useLazyDoesPhoneNumberExistQuery()

    const { status } = useAppSelector(state => state.auth)
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [phoneNumberStatus, setPhoneNumberStatus] = useState<string>('default')
    const [password, setPassword] = useState<string>('')
    const [passwordStatus, setPasswordStatus] = useState<'default' | 'entering' | 'valid'>('default')

    const [loading, setLoading] = useState(false)

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

    const handleSubmit = async () => {
        setLoading(true)
        
        try {
            const result = await dispatch(asyncSignIn({ phoneNumber: phoneNumber, password }))

            if ((result as any).error) {
                const doesPhoneNumberExist = await doesNumberExist(phoneNumber).unwrap()
                if (doesPhoneNumberExist) {
                    alert("Login failed. Please check to make sure your PASSWORD is correct")
                }
                else {
                    alert("Login failed. Please check to make sure your PHONE NUMBER is correct")
                }
            }

            else {
                console.log("signin successful; invalidating tags")
                // timeout to allow login even when asyncSignIn is slow to propagate
                setTimeout(() => {
                    dispatch({
                        // format -- reducerPath/invalidateTags
                        // see: https://github.com/reduxjs/redux-toolkit/issues/1862
                        type: `api/invalidateTags`,
                        payload: ['USER'],
                    });
                }, 1000)
            }
        }
        catch (err) {
            console.error(err)
            alert("Login failed. Please check to make sure your phone number and password are accurate")
        }
    }

    if (loading) {
        return <LoadingWrapper />
    }

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
            <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10,
            }}>
                <p style={{fontSize: 30, marginBottom: 20}}>Please Log In</p>
                {status === 'failed' && <div>Please check your phone number and password:</div>}
                <form autoComplete="off" spellCheck="false" style={{}}>
                    <div style={{ backgroundColor: "rgb(243,244,246)", borderRadius: 15, paddingTop: 2, paddingBottom: 2,
                        margin: "0 auto", width: 300, maxWidth: "calc(100vw - 20px)",
                    }}>
                        <Input
                            key="email"
                            spellCheck={false}
                            status={phoneNumberStatus}
                            placeholder="Phone Number"
                            autoComplete="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.trim().toLowerCase())}
                        />
                        <Input
                            key="password"
                            spellCheck={false}
                            status={passwordStatus}
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/*<InputSubAction onClick={() => dispatch(forgotPasswordFlowStarted())}>Forgot password?</InputSubAction>*/}
                    </div>

                    <div style={{marginTop: 30}}>
                        <div style={{fontWeight: 500, cursor: "pointer"}} onClick={handleSubmit}>Log In</div>
                        <Seperation>or</Seperation>
                        <BottomActionText onClick={() => dispatch(signUpFlowStarted())}>Create New Account</BottomActionText>
                    </div>
                </form>
            </div>
        </div>
    )
}