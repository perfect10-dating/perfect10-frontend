import { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { setSurveyData, setViewed, setStarted, setCompleted, setQuestionIndex } from '../services/surveySlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import {useCreateUserMutation, useFormRoomMutation} from '../services/api'

export function Home() {
    /** Logical Navigation:
     * 1. If the user is not logged in --> display LandingPage
     * 2.
     */

    let isLoggedIn = true
    if (!isLoggedIn) {

    }
}

