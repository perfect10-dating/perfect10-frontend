import { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { setSurveyData, setViewed, setStarted, setCompleted, setQuestionIndex } from '../services/surveySlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import {useCreateUserMutation, useFormRoomMutation} from '../services/api'

const testUserCreator = (userNumber: number, longitude: number, latitude: number): User => {
    // 1 degree of latitude or longitude = ~60 miles
    // so to distribute users in a 30-mile circle around me...
    let newLong = longitude + (Math.random() - 0.5)*0.5
    let newLat = latitude + (Math.random() - 0.5)*0.5

    let identity = (Math.random() > 0.5) ? "man" : "woman"
    let lookingFor = (identity === "man") ? "woman" : "man"

    console.log(`${userNumber} is a ${identity} looking for ${lookingFor} at [${newLong}, ${newLat}]`)

    return ({
        cognitoId: `${Math.floor(Math.random() * 1000000)}`,
        phoneNumber: `${Math.floor(Math.random() * 1000000)}`,
        firstName: `${userNumber}`,
        emailAddress: `${Math.floor(Math.random() * 1000000)}`,
        identity,
        dateOfBirth: 0,
        age: 20,
        lookingFor: [lookingFor],
        locationCoords: [newLong, newLat],
        ageRange: {min: 18, max: 30}
    })
}

var passthrough = 0

export function Home() {
    const [ createUser ] = useCreateUserMutation()
    const [ formRoom ] = useFormRoomMutation()

    if (passthrough > 0) {
        return (<div />)
    }
    else {
        navigator.geolocation.getCurrentPosition(async (position) => {

            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            // console.log("================ CREATING NEW USERS ================")
            // for (let i = 40; i < 80; i++) {
            //     let user = testUserCreator(i, long, lat);
            //     await createUser(user)
            // }
            // console.log("================ FINISHED NEW USERS ================")

            console.log("============= CREATING ROOM FOR USERS ================")
            await formRoom("64c598cab3500712b6e8d2dd")
            console.log("============= FINISHED ROOM FOR USERS ================")

            passthrough += 1
        })

        return (
            <div>Hello, world!</div>
        )
    }
}

