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
import {Loading} from "@minchat/react-chat-ui";
import {RerollRoom} from "./interacting/RerollRoom";

interface PropTypes {
    referringUser?: string
}

export function Home(props: PropTypes) {
    // const cognitoId = "607865"  // 19
    // const cognitoId = "890233"     // matilda
    // const cognitoId = "foo"     // 19
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    // set up API listeners for user, room, dates
    const {
        data: user,
        isLoading: userIsLoading,
        isSuccess: userReqSuccessful,
        isError: userReqFailed,
        error: userReqError
    } = useGetUserQuery()
    const {
        data: roomRetrievalObj,
        isLoading: roomIsLoading,
        isSuccess: roomReqSuccessful,
        isError: roomReqFailed,
        error: roomReqError
    } = useGetRoomQuery()

    // OR the isLoading
    const isLoading = roomIsLoading || userIsLoading

    // isDisplayingCompetitors -- otherwise, displaying dates (always false in one-sided room)
    const [isDisplayingCompetitors, setIsDisplayingCompetitors] = useState(false)

    // const nav = useNavigate()

    if (isLoading) {
        // TODO -- loading spinner
        return <Loading/>
    }
    else {
        /* ==================== BEGIN NAVIGATION LOGIC =================== */

        /** Logical Navigation:
         * 1. If the user is not logged in --> navigate to /landing
         * 2. If the user is waiting to complete a date and NOT passed that time --> navigate to /waiting-date
         * 3. If the user is waiting to complete a date and IS passed that time --> navigate to /date-review
         * 4. If the user is waiting for a time to unlock --> navigate to /waiting-time
         * 5. If the user hasn't completed their profile
         * 6. If the user is not waiting for either a date or time (or the time has passed), but is not in a room --> navigate to /join-room-query
         * 7. If the user is waiting for the creation of a room --> navigate to /waiting-room
         * 8. Otherwise, display the room the user is in
         */

        if (!user) {
            console.log("No user detected ... please log in")
            return <LandingPage referringUser={props.referringUser} />
        }

        else {
            // set the user that we retrieved
            console.log("setting user...")
            dispatch(setUser({user}))

            // if the profile is not complete, immediately nav them to /account to finish it
            if (!user.profileComplete) {
                navigate("/account")
            }

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

            let isOneSided = false
            let potentialPartners, competitors
            // if this is a one-identity room, your partners and competitors are the same
            // prevent you from seeing yourself
            if (room.sideTwo.length === 0) {
                isOneSided = true
                potentialPartners = room.sideOne.filter(sideOneUser => sideOneUser._id !== user?._id)
                competitors = potentialPartners
            }
            else if (room.sideOneIdentity === user?.identity) {
                potentialPartners = room.sideTwo
                competitors = room.sideOne
            } else {
                potentialPartners = room.sideOne
                competitors = room.sideTwo
            }

            return (
                <div style={{paddingTop: 50, overflow: 'scroll', maxHeight: "100vh"}}>
                    <div style={{fontSize: 30, textAlign: "center", marginTop: 30}}>
                        {
                            // only display the toggle if this is not a one-sided room
                            // (if it is one-sided, only display partners)
                            !isOneSided &&
                            isDisplayingCompetitors ? "Your Competitors" : "Your Potential Matches"
                        }
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

