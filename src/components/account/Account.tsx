import {useAppDispatch} from "../../app/hooks";
import {useEditUserMutation, useGetUserQuery} from "../../services/api";
import {useNavigate} from "react-router-dom";
import {LookingFor} from "./LookingFor";
import {Loading} from "@minchat/react-chat-ui";
import {AgeRange} from "./AgeRange";
import {useEffect, useState} from "react";

const POLLING_DELAY_SECONDS = 5

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
        console.log(isDirty, !!user)
        editUser({lookingFor, ageRange})
        setWillEdit(false)
        setIsDirty(false)
    }

    // if no user, we'll pop back to the "/" route, which will handle login
    if (userReqFailed) {
        navigate("/")
    }

    if (!user) {
        return <Loading />
    }

    return (
        <div>
            <div>
                Welcome, {user?.firstName || "Stranger"}
            </div>
            <div>
                {user.profileComplete ? "Continue editing your profile" : "Complete your profile"}
            </div>
            <LookingFor initialLookingFor={user.lookingFor} lookingForCallback={(lookingFor) => {
                setLookingFor(lookingFor)
                setIsDirty(true)
            }} />
            <AgeRange default={user.ageRange} onChange={(ageRange) => {
                setAgeRange(ageRange)
                setIsDirty(true)
            }} />


        </div>
    )
}