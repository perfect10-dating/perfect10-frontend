import { useAppDispatch } from 'app/hooks'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {asyncGetUser, asyncSignIn, asyncSignUp, signInFlowStarted, signUpFlowCanceled} from 'services/authSlice'
import { BottomActionText, Input, LoginBox, Name, Seperation, Subheader, Submit } from './LoginComponents'
import {LookingFor} from "../account/LookingFor";
import {setHasCollectedLocation} from "../../services/userSlice";
import {getBirthDateString} from "../../utils/getBirthDateString";
import {LoadingWrapper} from "../misc/LoadingWrapper";
import appConfiguration from "../../appConfiguration";
import Toggle from "rsuite/Toggle";
import {useLogQrCodeMutation} from "../../services/api";
import axios from "axios";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const inputFormStyle = {width: "calc(100% - 40px)", padding: 10, marginLeft: 20, marginRight: 20, height: 40,
    borderRadius: 10, border: 0, backgroundColor: "rgb(194, 213, 242)"}

interface PropTypes {
    referringUser?: string;
    qrCode?: string;
}

export const SignUp = (props: PropTypes) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [logQrCode] = useLogQrCodeMutation()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [firstName, setFirstName] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [countryCode, setCountryCode] = useState('+1')
    const [phoneNumberStatus, setPhoneNumberStatus] = useState<'default' | 'entering' | 'valid'>('default')
    
    const [emailAddress, setEmailAddress] = useState<string>('')
    const [emailAddressStatus, setEmailAddressStatus] = useState<'default' | 'entering' | 'valid'>('default')
    
    const [identity, setIdentity] = useState("woman")
    const [birthDate, setBirthDate] = useState(0)
    const [password, setPassword] = useState<string>('')
    const [passwordStatus, setPasswordStatus] = useState<'default' | 'entering' | 'valid'>('default')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState<'default' | 'entering' | 'valid'>('default')
    const [lookingFor, setLookingFor] = useState([] as string[])
    const [acceptedDocuments, setAcceptedDocuments] = useState(false)

    const [eightCharactersInPassword, setEightCharactersInPassword] = useState(false)
    const [upperCaseInPassword, setUpperCaseInPassword] = useState(false)
    const [lowerCaseInPassword, setLowerCaseInPassword] = useState(false)
    const [numberInPassword, setNumberInPassword] = useState(false)
    const [specialCharacterInPassword, setSpecialCharacterInPassword] = useState(false)

    useEffect(() => {
        const newStatus = phoneNumber.length === 0 ? 'default' :
            /^\+[1-9]\d{3,14}$/.test(countryCode+phoneNumber) ? 'valid' : 'entering'
        setPhoneNumberStatus(newStatus)
    }, [ countryCode, phoneNumber])
    
    useEffect(() => {
        const newStatus = emailAddress.length === 0 ? 'default' : /\S+@\S+\.\S+/.test(emailAddress) ? 'valid' : 'entering'
        setEmailAddressStatus(newStatus)
    }, [emailAddress])

    useEffect(() => {
        const eightCharactersInPasswordLocal = password.length >= 8
        const lowerCaseInPasswordLocal = /^(?=.*[a-z])/.test(password)
        const upperCaseInPasswordLocal = /^(?=.*[A-Z])/.test(password)
        const numberInPasswordLocal = /^(?=.*\d)/.test(password)
        const specialCharacterInPasswordLocal = /^(?=.*[\^$*.\[\]{}()?\-"!@#%&/\\,><':;|_~`+=])/.test(password)
        const newStatus = password.length === 0 ? 'default' : (eightCharactersInPasswordLocal &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.\[\]{}()?\-"!@#%&/\\,><':;|_~`+=])[A-Za-z\d^$*.\[\]{}()?\-"!@#%&/\\,><':;|_~`+=]{8,}$/.test(password))
            ? 'valid' : 'entering'

        setEightCharactersInPassword(eightCharactersInPasswordLocal)
        setLowerCaseInPassword(lowerCaseInPasswordLocal)
        setUpperCaseInPassword(upperCaseInPasswordLocal)
        setNumberInPassword(numberInPasswordLocal)
        setSpecialCharacterInPassword(specialCharacterInPasswordLocal)
        setPasswordStatus(newStatus)
    }, [password])

    useEffect(() => {
        const newStatus = confirmPassword.length === 0 ? 'default' : confirmPassword.length < 8 ? 'entering' : 'valid'
        setConfirmPasswordStatus(newStatus)
    }, [confirmPassword])

    const handleSubmit = async () => {
        if (phoneNumberStatus !== 'valid') return alert('Please enter a valid phone number.')
        if (emailAddressStatus !== 'valid') return alert('Please enter a valid email address.')
        if (passwordStatus !== 'valid') return alert('Please make sure your password is at least 8 characters long.')
        if (password !== confirmPassword) return alert('Please make sure your passwords match.')
        if (((Date.now() - birthDate) / (1000 * 60 * 60 * 24 * 365)) < 18) return alert("Minors are not allowed")
        if (!acceptedDocuments) return alert("Please review and accept our Terms and Conditions and Privacy Policy")

        try {
            console.log("here...")
            let {lat, long} = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((position) => {
                        resolve({lat: position.coords.latitude, long: position.coords.longitude})
                    },
                    async(err) => {
                    // if we don't get a GeolocationPosition for any reason,
                        console.error(err)
                        try {
                            console.log("Failed to get a geolocation position, using IP positioning instead...")
                            let result = await axios.get("https://api.ipgeolocation.io/ipgeo?apiKey=8096ee38555f4290ad6e0b17caf6d393")
                            return resolve({lat: result.data.latitude, long: result.data.longitude})
                        }
                        catch (err) {
                            console.error(err)
                            return reject(err)
                        }
                    },
                    {timeout: 30000} // timeout in ms
                    )
            })

            // console.log(lat, long)
            setIsSubmitting(true)

            let result: any = await dispatch(asyncSignUp(
                { phoneNumber: countryCode+phoneNumber,
                    emailAddress,
                    password, firstName, birthDate, identity,
                    latitude: lat, longitude: long, lookingFor: Array.from(lookingFor) }
            ))
            if (result.error) {
                setIsSubmitting(false)
                console.error(result.error)
                alert(
                    `Failed to create account. Do you already have an existing account? If not, please contact us if the error persists.
                    ${appConfiguration.supportEmail}
                    \nError info: ${result.error.message}`
                )
            }
            else {
                // sign in with the new credentials
                await dispatch(asyncSignIn({phoneNumber: countryCode+phoneNumber, password}))
                // tell the app that we have accurate location
                await dispatch(setHasCollectedLocation({hasUpdatedLocation: true}))
                // if there is a qr code, let the backend know it has been used
                if (props.qrCode) {
                    logQrCode({qrCode: props.qrCode})
                }

                // now we invalidate the user cache and navigate to /profile (so they can fill other information...)
                // however, we must await a timeout first to allow time for the API object to be created
                await new Promise(resolve => setTimeout(resolve, 1000))
                navigate("/account")
                return dispatch({
                    // format -- reducerPath/invalidateTags
                    // see: https://github.com/reduxjs/redux-toolkit/issues/1862
                    type: `api/invalidateTags`,
                    payload: ['USER'],
                });
            }
        }
        catch (err) {
            setIsSubmitting(false)
            console.error(err)
            alert(`An error occurred when creating your account. Error info: ${err.message}}`)
        }
    }

    // show the loading spinner if we're submitting
    if (isSubmitting) {
        return <LoadingWrapper />
    }

    return (
        <div style={{height: "100vh", overflow: "scroll"}}>
            <form spellCheck="false" style={{width: 300, maxWidth: "100vw", margin: "0 auto"}}>
                <p style={{fontSize: 30, textAlign: "center", marginTop: 30, marginBottom: 10}}>Create Account</p>
                <div style={{cursor: "pointer", marginBottom: 10, textAlign: "center"}} onClick={() => dispatch(signInFlowStarted())}>
                    {"Sign in with existing account >>"}
                </div>

                <div style={{ backgroundColor: "rgb(243,244,246)", borderRadius: 15, paddingTop: 2, paddingBottom: 2,
                    margin: "20 auto", marginBottom: 30, width: 300, maxWidth: "calc(100vw - 20px)",
                }}>
                    <Input
                        key="firstName"
                        spellCheck={false}
                        status={firstName.length > 0 ? 'valid' : 'default'}
                        placeholder="First name"
                        autoComplete="none"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value.trim())}
                    />
                    {/*<div style={{fontSize: 12, textAlign: "left", marginLeft: 25, marginBottom: -25}}>Format: +12345678901 (include country code)</div>*/}
                    <div style={{display: "flex", maxWidth: "100%", marginBottom: -25}}>
                        <PhoneInput
                            buttonStyle={{width: 40}}
                            inputStyle={{width: 80}}
                            containerStyle={{width: 80, height: 35, marginTop: -3, marginLeft: 25}}
                            country={'us'}
                            value={countryCode}
                            onChange={code => {
                                setCountryCode(`+${code}`)
                            }}
                        />
                        <Input
                            style={{marginTop: 0, width: "calc(100% - 130px)", marginLeft: 5, marginRight: 25, marginBottom: 25}}
                            key="phoneNumber"
                            spellCheck={false}
                            status={phoneNumberStatus}
                            placeholder="Phone Number"
                            autoComplete="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.trim().toLowerCase())}
                        />
                    </div>
    
                    <Input
                      key="email"
                      spellCheck={false}
                      status={emailAddressStatus}
                      placeholder="Email Address"
                      autoComplete="none"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value.trim().toLowerCase())}
                    />

                    {/*<div style={{marginLeft: 25, marginRight: 25, marginTop: -25, display: "flex"}}>*/}
                    {/*    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>*/}
                    {/*        <Toggle />*/}
                    {/*    </div>*/}
                    {/*    <div style={{marginLeft: 10, fontSize: 12}}>*/}
                    {/*        Send me notifications to this phone number.*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div style={{textAlign: "center"}}>
                    <div style={{fontSize: 12, textAlign: "left", marginLeft: 25}}>What group do you most identify as?</div>
                    <select defaultValue={identity}
                            style={inputFormStyle}
                            onChange={(e) => setIdentity(e.target.value)}>
                        <option value={"woman"}>Woman</option>
                        <option value={"man"}>Man</option>
                        <option value={"nonbinary"}>Non-binary</option>
                        <option value={"transWoman"}>Trans woman</option>
                        <option value={"transMan"}>Trans man</option>
                    </select>
                </div>

                <LookingFor lookingForCallback={setLookingFor} />

                <div style={{textAlign: "center", marginTop: 30}}>
                    <div style={{fontSize: 12, textAlign: "left", marginLeft: 25}}>Select your birthday</div>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        style={inputFormStyle}

                        onChange={(e) => {
                            console.log(getBirthDateString((new Date(e.target.value)).getTime()))
                            setBirthDate((new Date(e.target.value)).getTime())
                        }}
                    />
                </div>

                <div style={{ backgroundColor: "rgb(243,244,246)", borderRadius: 15, paddingTop: 2, paddingBottom: 2,
                    margin: "0 auto", marginBottom: 10, marginTop: 30, width: 300, maxWidth: "calc(100vw - 20px)",
                }}>
                    <Input
                        key="password"
                        spellCheck={false}
                        status={passwordStatus}
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div style={{fontSize: 12, marginTop: -25, marginBottom: -10, marginLeft: 12, marginRight: 12}}>
                        Requirements: {
                            [
                                {show: !eightCharactersInPassword, text: "8+ characters"},
                                {show: !upperCaseInPassword, text: "1 uppercase letter"},
                                {show: !lowerCaseInPassword, text: "1 lowercase letter"},
                                {show: !numberInPassword, text: "1 number"},
                                {show: !specialCharacterInPassword, text: "1 special character"},
                            ].filter(object => object.show).map(object => object.text).join(", ")
                        }
                    </div>
                    <Input
                        key="confirmPassword"
                        spellCheck={false}
                        status={confirmPasswordStatus}
                        type="password"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div style={{display: "flex", marginBottom: 30}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", marginRight: 10}}>
                        <Toggle onChange={setAcceptedDocuments} />
                    </div>
                    <div>
                        I accept Rizzly's <a href={"/terms-conditions"} target="_blank">
                        Terms and Conditions
                        </a> and <a href={"/privacy-policy"} target="_blank">
                        Privacy Policy</a>
                    </div>
                </div>

                <div style={{margin: "0 auto", paddingBottom: 100, textAlign: "center", fontSize: 20}}>
                    <div style={{cursor: "pointer"}} onClick={handleSubmit} >{"Sign Up >>"}</div>
                </div>

            </form>
        </div>
    )
}