import {useAppDispatch} from "../../app/hooks";
import {useEditUserMutation, useGetUserQuery} from "../../services/api";
import {useNavigate} from "react-router-dom";
import {LookingFor} from "./LookingFor";
import {Loading} from "@minchat/react-chat-ui";
import {AgeRange} from "./AgeRange";
import {useEffect, useState} from "react";
import {ImageUploader} from "./ImageHandling/ImageUploader";

const POLLING_DELAY_SECONDS = 5
const USER_AVAILABLE_AGE_GAP = 15

export function Account() {
    // const cognitoId = "607865"  // 19
    // const cognitoId = "890233"     // matilda
    // const cognitoId = "foo"     // 19
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [editUser] = useEditUserMutation()

    // set up API listeners for user, room, dates
    const {
        data: user,
        isLoading: userIsLoading,
        isSuccess: userReqSuccessful,
        isError: userReqFailed,
        error: userReqError,
        // isUninitialized
    } = useGetUserQuery()

    const [isDirty, setIsDirty] = useState(false)
    const [lookingFor, setLookingFor] = useState(user?.lookingFor || [])
    const [ageRange, setAgeRange] = useState(user?.ageRange || {min: 25, max: 35})
    const [willEdit, setWillEdit] = useState(false)

    useEffect(() => {
        console.log("Polling started")

        // will try to save the user
        const pollingFunction = async() => {
            while (true) {
                setWillEdit(true)
                await new Promise((resolve) => setTimeout(resolve, POLLING_DELAY_SECONDS * 1000))
            }
        }
        pollingFunction()
    }, [1])

    if (willEdit && isDirty && user) {
        setIsDirty(false)
        setWillEdit(false)
        editUser({lookingFor, ageRange})
    }

    // if no user, we'll pop back to the "/" route, which will handle login
    if (userReqFailed) {
        navigate("/")
    }

    if (!user) {
        return <Loading />
    }

    return (
        <div style={{height: "100vh", overflow: "scroll"}}>
            <div style={{width: 300, maxWidth: "100vw", margin: "0 auto", marginTop: 50}}>
                <div style={{textAlign: "center", fontSize: 30}}>
                    Welcome, {user?.firstName || "Stranger"}
                </div>
                <div style={{textAlign: "center"}}>
                    {user.profileComplete ? "Continue editing your profile" : "Complete your profile"}
                </div>
                <ImageUploader imageUrl={} handleChange={} />
                <LookingFor initialLookingFor={user.lookingFor} lookingForCallback={(lookingFor) => {
                    setLookingFor(lookingFor)
                    setIsDirty(true)
                }} />
                <AgeRange default={user.ageRange}
                          limits={{min: Math.max(18, user.age-USER_AVAILABLE_AGE_GAP),
                              max: Math.min(99, user.age+USER_AVAILABLE_AGE_GAP)}}
                          onChange={(ageRange) => {
                              setAgeRange(ageRange)
                              setIsDirty(true)
                          }} />
            </div>
        </div>
    )
}