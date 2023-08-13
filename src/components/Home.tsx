import {useEffect, useState} from 'react'
import styled from 'styled-components'
import {BrowserRouter, useNavigate, useParams} from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import {useGetRoomQuery, useGetUserQuery} from '../services/api'
import {RoomDisplay} from "./interacting/RoomDisplay";
import {setDates, setRoom, setUser, UserState} from "../services/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {LandingPage} from "./entry/LandingPage";
import {WaitingForDate} from "./waiting/WaitingForDate";
import {DateReview} from "./recording_date/DateReview";
import {WaitingForTime} from "./waiting/WaitingForTime";
import {WaitingForRoom} from "./waiting/WaitingForRoom";
import {JoinNewRoom} from "./recording_date/JoinNewRoom";

function loading() {
    return (
        <div>
            Loading...
        </div>
    )
}

export function Home() {
    // const cognitoId = "607865"  // 19
    const cognitoId = "890233"     // matilda
    const dispatch = useAppDispatch()

    // set up API listeners for user, room, dates
    const {
        data: user,
        isLoading: userIsLoading,
        isSuccess: userReqSuccessful,
        isError: userReqFailed,
        error: userReqError
    } = useGetUserQuery(cognitoId)
    const {
        data: roomRetrievalObj,
        isLoading: roomIsLoading,
        isSuccess: roomReqSuccessful,
        isError: roomReqFailed,
        error: roomReqError
    } = useGetRoomQuery(cognitoId)

    // OR the isLoading
    const isLoading = roomIsLoading || userIsLoading

    // isDisplayingCompetitors -- otherwise, displaying dates (always false in one-sided room)
    const [isDisplayingCompetitors, setIsDisplayingCompetitors] = useState(false)

    // const nav = useNavigate()

    if (isLoading) {
        // TODO -- loading spinner
        return loading()
    }
    else {
        /* ==================== BEGIN NAVIGATION LOGIC =================== */

        /** Logical Navigation:
         * 1. If the user is not logged in --> navigate to /landing
         * 2. If the user is waiting to complete a date and NOT passed that time --> navigate to /waiting-date
         * 3. If the user is waiting to complete a date and IS passed that time --> navigate to /date-review
         * 4. If the user is waiting for a time to unlock --> navigate to /waiting-time
         * 5. If the user is not waiting for either a date or time (or the time has passed), but is not in a room --> navigate to /join-room-query
         * 6. If the user is waiting for the creation of a room --> navigate to /waiting-room
         * 7. Otherwise, display the room the user is in
         */

        if (!user) {
            console.log("No user detected ... please log in")
            return <LandingPage />
        }

        else {
            // set the user that we retrieved
            console.log("setting user...")
            console.log(user)
            dispatch(setUser({user}))

            // the user is being blocked by a date
            if (user.mustReviewDate) {
                // the user needs to wait
                if (user.lockingDate && (new Date(user.lockingDate.time)).getTime() > Date.now()) {
                    console.log("waiting for date")
                    return <WaitingForDate user={user as User} />
                }
                // the user needs to review the date
                else {
                    console.log("reviewing date")
                    return <DateReview user={user as User} />
                }
            }

            // the user is being blocked by time
            if (user.temporarilyLocked) {
                return <WaitingForTime user={user as User} />
            }

            // the user is waiting to join a room
            if (user.waitingForRoom) {
                return <WaitingForRoom user={user as User} />
            }

            // the user is otherwise not in a room (but there is no reason they aren't)
            // we'll ask them if they wish to join a new room
            if (user.currentRoom === null || !roomRetrievalObj) {
                return <JoinNewRoom user={user as User} />
            }

            // otherwise, we're in the right spot (and we can display the room)
            // tell TypeScript that roomRetrievalObj is not undefined
            const {room, dates} = roomRetrievalObj
            dispatch(setRoom({currentRoom: room}))
            dispatch(setDates({dates}))

            /* ==================== END NAVIGATION LOGIC =================== */

            /* ==================== BEGIN RENDER LOGIC =================== */

            let potentialPartners, competitors
            if (room.sideOneIdentity === user?.identity) {
                potentialPartners = room.sideTwo
                competitors = room.sideOne
            } else {
                potentialPartners = room.sideOne
                competitors = room.sideTwo
            }

            return (
                <div>
                    <div style={{fontSize: 30, textAlign: "center", marginTop: 30}}>
                        {isDisplayingCompetitors ? "Your Competitors" : "Your Potential Matches"}
                    </div>
                    <div style={{fontSize: 16, textAlign: "center", cursor: "pointer"}}
                        onClick={() => setIsDisplayingCompetitors(!isDisplayingCompetitors)}
                    >
                        {isDisplayingCompetitors ? "View Potential Matches >>" : "View Competitors >>"}
                    </div>
                    <RoomDisplay
                        isDisplayingCompetitors={isDisplayingCompetitors}
                        potentialPartners={potentialPartners || []}
                        competitors={competitors || []}
                        dates={dates || []}
                    />
                </div>
            )
        }
    }
}

