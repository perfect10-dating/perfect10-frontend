import { useAppDispatch } from 'app/hooks'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { asyncSignUp, signUpFlowCanceled } from 'services/authSlice'
import { BottomActionText, Input, LoginBox, Name, Seperation, Subheader, Submit } from './LoginComponents'

const inputFormStyle = {width: "calc(100% - 40px)", padding: 10, marginLeft: 20, marginRight: 20, height: 40,
    borderRadius: 10, border: 0, backgroundColor: "rgb(194, 213, 242)"}

export const SignUp = ({ style }: { style?: any }) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const [firstName, setFirstName] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [phoneNumberStatus, setPhoneNumberStatus] = useState<'default' | 'entering' | 'valid'>('default')
    const [identity, setIdentity] = useState("woman")
    const [birthDate, setBirthDate] = useState(0)
    const [password, setPassword] = useState<string>('')
    const [passwordStatus, setPasswordStatus] = useState<'default' | 'entering' | 'valid'>('default')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState<'default' | 'entering' | 'valid'>('default')

    useEffect(() => {
        const newStatus = phoneNumber.length === 0 ? 'default' : /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(phoneNumber) ? 'valid' : 'entering'
        setPhoneNumberStatus(newStatus)
    }, [phoneNumber])

    useEffect(() => {
        const newStatus = password.length === 0 ? 'default' : password.length < 8 ? 'entering' : 'valid'
        setPasswordStatus(newStatus)
    }, [password])

    useEffect(() => {
        const newStatus = confirmPassword.length === 0 ? 'default' : confirmPassword.length < 8 ? 'entering' : 'valid'
        setConfirmPasswordStatus(newStatus)
    }, [confirmPassword])

    const handleSubmit = () => {
        if (phoneNumberStatus !== 'valid') return alert('Please enter a valid phoneNumber address.')
        if (passwordStatus !== 'valid') return alert('Please make sure your password is at least 8 characters long.')
        if (password !== confirmPassword) return alert('Please make sure your passwords match.')
        dispatch(asyncSignUp({ phoneNumber, password, firstName }))
            .then((result: any) => {
                if (result.error) {
                    console.error(result.error)
                    alert(
                        `Failed to create account. Do you already have an existing account? If not, please contact us if the error persists.\n\nError info: ${result.error.message}`
                    )
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }

    return (
        <div style={{height: "100vh", overflow: "scroll"}}>
            <form spellCheck="false" style={{width: 300, maxWidth: "100vw", margin: "0 auto"}}>
                <p style={{fontSize: 30, textAlign: "center", marginTop: 30, marginBottom: 20}}>Create Account</p>

                <div style={{ backgroundColor: "rgb(243,244,246)", borderRadius: 15, paddingTop: 2, paddingBottom: 2,
                    margin: "20 auto", marginBottom: 30, width: 300, maxWidth: "calc(100vw - 20px)",
                }}>
                    <Input
                        key="firstName"
                        status={firstName.length > 0 ? 'valid' : 'default'}
                        placeholder="First name"
                        autoComplete="none"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value.trim())}
                    />
                    <Input
                        key="phoneNumber"
                        status={phoneNumberStatus}
                        placeholder="Phone Number"
                        autoComplete="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.trim().toLowerCase())}
                    />
                </div>
                <div style={{textAlign: "center"}}>
                    <div style={{fontSize: 20}}>Select your gender identity</div>
                    <div>Currently you may only identify within the gender binary... we're working on it!</div>
                    <select defaultValue={identity}
                            style={inputFormStyle}
                            onChange={(e) => setIdentity(e.target.value)}>
                        <option value={"woman"}>Woman</option>
                        <option value={"man"}>Man</option>
                    </select>
                </div>

                <div style={{textAlign: "center", marginTop: 30}}>
                    <div style={{fontSize: 20}}>Select your birthday</div>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={birthDate}

                        style={inputFormStyle}

                        onChange={(e) => {
                            setBirthDate((new Date(e.target.value)).getTime())
                        }}
                    />
                </div>

                <div style={{ backgroundColor: "rgb(243,244,246)", borderRadius: 15, paddingTop: 2, paddingBottom: 2,
                    margin: "0 auto", marginBottom: 20, marginTop: 30, width: 300, maxWidth: "calc(100vw - 20px)",
                }}>
                    <Input
                        key="password"
                        status={passwordStatus}
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        key="confirmPassword"
                        status={confirmPasswordStatus}
                        type="password"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                </div>
                <div style={{margin: "0 auto", paddingBottom: 30, textAlign: "center"}}>
                    <div style={{cursor: "pointer"}} onClick={handleSubmit} >{"Sign Up >>"}</div>
                    <p>or</p>
                    <div style={{cursor: "pointer"}} onClick={() => dispatch(signUpFlowCanceled())}>
                        {"Sign in with Existing Account >>"}
                    </div>
                </div>

            </form>
        </div>
    )
}