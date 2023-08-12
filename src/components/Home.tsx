import {useEffect, useState} from 'react'
import styled from 'styled-components'
import {BrowserRouter, useNavigate, useParams} from 'react-router-dom'
import { setSurveyData, setViewed, setStarted, setCompleted, setQuestionIndex } from '../services/surveySlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import {useGetUserQuery} from '../services/api'
import {RoomDisplay} from "./interacting/RoomDisplay";

export function Home() {
    const [ getUser ] = useGetUserQuery()

    // isLoading -- whether to display the spinner instead of the room
    const [isLoading, setIsLoading] = useState(true)
    // isDisplayingCompetitors -- otherwise, displaying dates (always false in one-sided room)
    const [isDisplayingCompetitors, setIsDisplayingCompetitors] = useState(false)

    const nav = useNavigate()

    useEffect(() => {
        /** Logical Navigation:
         * 1. If the user is not logged in --> navigate to /landing
         * 2. If the user is waiting to complete a date and NOT passed that time --> navigate to /waiting-date
         * 3. If the user is waiting to complete a date and IS passed that time --> navigate to /date-review
         * 4. If the user is waiting for a time to unlock --> navigate to /waiting-time
         * 5. If the user is not waiting for either a date or time (or the time has passed), but is not in a room --> navigate to /join-room-query
         * 6. If the user is waiting for the creation of a room --> navigate to /waiting-room
         * 7. Otherwise, display the room the user is in
         */

        const loadingFunction = async() => {
            const user = getUser("TODO")
            if (!user) {
                return nav("/landing")
            }

            // the user is being blocked by a date
            if (user.mustReviewDate) {
                // the user needs to wait
                if (user.lockingDate.time > Date.now()) {
                    return nav("/waiting-date")
                }
                // the user needs to review the date
                else {
                    return nav("/date-review")
                }
            }

            // the user is being blocked by time
            if (user.temporarilyLocked && user.unlockTime > Date.now()) {
                return nav("/waiting-time")
            }

            // the user is waiting to join a room
            if (user.waitingForRoom) {
                return nav("/waiting-room")
            }

            // the user is otherwise not in a room (but there is no reason they aren't)
            if (user.currentRoom === null) {
                return nav("/join-room-query")
            }

            // otherwise, we're in the right spot (and we can display the room)
            setIsLoading(false)
        }
        loadingFunction()
            .catch(err => {
                console.error(err)
                // TODO -- show the user something
            })
    })

    if (isLoading) {
        // TODO -- loading spinner
        return (
            <div>
                Loading...
            </div>
        )
    }
    else {
        return (
            <div>
                <RoomDisplay
                    isDisplayingCompetitors={isDisplayingCompetitors}

                />
            </div>
        )
    }
}

