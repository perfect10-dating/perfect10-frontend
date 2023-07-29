import { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { setSurveyData, setViewed, setStarted, setCompleted, setQuestionIndex } from '../services/surveySlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useGetSurveyQuery, usePostSurveyInteractionMutation, usePutSurveyMaskMutation } from '../services/api'

import { BooleanQuestion } from './question_types/BooleanQuestion'
import { MultipleChoice } from './question_types/MultipleChoice'
import { FreeResponseQuestion } from './question_types/FreeResponseQuestion'
import { Rank } from './question_types/Rank'
import { Rate } from './question_types/Rate'
import { CallToAction } from './CallToAction'
import { ImageChoice } from './question_types/ImageChoice'
import { ImageRank } from './question_types/ImageRank'

const STORAGE_NAMESPACE = 'bwi.' // local storage namespace

export function Survey() {
  const { mask } = useParams()
  const { data, isLoading } = useGetSurveyQuery(String(mask))
  const questions = useAppSelector((state) => state.survey.questions)
  const questionIndex = useAppSelector((state) => state.survey.questionIndex)
  // const viewed = useAppSelector(state => state.survey.viewed)
  // const started = useAppSelector(state => state.survey.started)
  // const completed = useAppSelector(state => state.survey.completed)
  const { viewed, started, completed } = useAppSelector((state) => state.survey)
  const desktopImageUrl = useAppSelector((state) => state.survey.desktopImageUrl)

  const [postSurveyInteraction] = usePostSurveyInteractionMutation()
  const [putSurveyMask] = usePutSurveyMaskMutation()
  const dispatch = useAppDispatch()

  // handle views
  useEffect(() => {
    if (!data || !data._id) {
      return
    }
    if (!viewed) {
      if (!data.previewMode) {
        let viewedLocalStorageKey = data._id + '.view'
        if (!getLocalStorage(viewedLocalStorageKey)) {
          postSurveyInteraction({ type: 'view', survey: data?._id, utm: window.location.search })
          setLocalStorage(viewedLocalStorageKey, '1')
        }
      }
      dispatch(setViewed())
    }
  }, [data, viewed, dispatch, postSurveyInteraction])

  // handle starts
  useEffect(() => {
    if (!data || !data._id) {
      return
    }
    if (!started && questionIndex > 0) {
      if (!data.previewMode) {
        let startedLocalStorageKey = data._id + '.start'
        if (!getLocalStorage(startedLocalStorageKey)) {
          postSurveyInteraction({ type: 'start', survey: data?._id, utm: window.location.search })
          setLocalStorage(startedLocalStorageKey, '1')
        }
      }
      dispatch(setStarted())
    }
  }, [data, started, questionIndex, dispatch, postSurveyInteraction])

  // handle completions
  useEffect(() => {
    if (!data || !data._id) {
      return
    }
    let completedLocalStorageKey = data._id + '.completion'
    if (viewed && started && !completed && questionIndex === questions.length) {
      if (!data.previewMode && !getLocalStorage(completedLocalStorageKey)) {
        postSurveyInteraction({ type: 'completion', survey: data?._id, utm: window.location.search })
        setLocalStorage(completedLocalStorageKey, '1')
        if (mask && mask.length > 20) {
          putSurveyMask({ _id: mask, delta: { surveyComplete: true } }).catch((err: any) => console.log(err))
        }
      }
      dispatch(setCompleted())
    }
  }, [data, viewed, started, completed, questionIndex, questions, dispatch, mask, postSurveyInteraction, putSurveyMask])

  // handle existing question votes
  useEffect(() => {
    if (!data || !data._id || data.previewMode) {
      return
    }
    let startingQuestionIndex = 0
    for (let question of questions) {
      if (question._id && !!getLocalStorage(question._id)) {
        startingQuestionIndex++
      } else {
        break
      }
    }
    dispatch(setQuestionIndex(startingQuestionIndex))
  }, [questions, data, dispatch])

  // handle survey load and existing completion check
  useEffect(() => {
    if (!data || !data._id) {
      return
    }

    // load survey
    dispatch(setSurveyData(data))

    // handle existing completion
    let completedLocalStorageKey = data._id + '.completion'
    if (!completed && !data.previewMode && getLocalStorage(completedLocalStorageKey)) {
      dispatch(setCompleted())
    }
  }, [data, completed, dispatch])

  // LocalStorage getter - prepends STORAGE_NAMESPACE to key
  const getLocalStorage = (key: string) => {
    try {
      return window.localStorage.getItem(STORAGE_NAMESPACE + key)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  // LocalStorage setter - prepends STORAGE_NAMESPACE to key
  const setLocalStorage = (key: string, value: string) => {
    try {
      return window.localStorage.setItem(STORAGE_NAMESPACE + key, value)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  const handleVote = (question: any, choiceIndex: number) => {
    console.log(`${question} ${choiceIndex}`)
    if (!data) return

    if (!data.previewMode) {
      setLocalStorage(question._id, '' + choiceIndex)
    }

    let earlyExitTriggered = false
    if (
      data.earlyExits &&
      data.earlyExits[question._id] &&
      data.earlyExits[question._id].length &&
      data.earlyExits[question._id].indexOf(choiceIndex) !== -1
    ) {
      earlyExitTriggered = true
    }

    if (earlyExitTriggered || questionIndex >= questions.length - 1) {
      // survey is complete
      if (!data.previewMode) {
        // attempt to register question as voted upon in LocalStorage if the server accepted the vote
        let completedLocalStorageKey = data._id + '.completion'
        if (!getLocalStorage(completedLocalStorageKey)) {
          postSurveyInteraction({ type: 'completion', survey: data?._id, utm: window.location.search })
          if (mask && mask.length === 24 && /^[a-f0-9]+$/i.test(mask)) {
            // todo: better check for objectid
            putSurveyMask({ _id: mask, delta: { surveyComplete: true } }).catch((err: any) => console.log(err))
          }
          setLocalStorage(completedLocalStorageKey, '1')
        }
      }
      dispatch(setCompleted())
    }
  }

  const question = data ? data.questions[questionIndex] : null

  return (
    <SurveyDisplay
      style={
        data && data.background
          ? { background: data.background }
          : {
              background:
                'linear-gradient(45deg, rgb(22, 94, 139), rgb(129, 203, 227)) 50% 50% / cover no-repeat fixed',
            }
      }
    >
      <ProgressBar>
        <ProgressBarFilled progress={((questionIndex + 1) / questions.length) * 100} />
      </ProgressBar>

      {desktopImageUrl ? (
        <LogoWrapper>
          <Logo src={desktopImageUrl} />
        </LogoWrapper>
      ) : (
        <LogoPlaceholder></LogoPlaceholder>
      )}

      {!completed && question && question.type === 'boolean' ? (
        <BooleanQuestion survey={data} question={question} onVote={handleVote} />
      ) : null}
      {!completed && question && question.type === 'multiple-choice' ? (
        <MultipleChoice survey={data} question={question} onVote={handleVote} />
      ) : null}
      {!completed && question && question.type === 'image-choice' ? (
        <ImageChoice survey={data} question={question} onVote={handleVote} />
      ) : null}
      {!completed && question && question.type === 'rank' ? (
        <Rank survey={data} question={question} onVote={handleVote} />
      ) : null}
      {!completed && question && question.type === 'image-rank' ? (
        <ImageRank survey={data} question={question} onVote={handleVote} />
      ) : null}
      {!completed && question && question.type === 'rate' ? (
        <Rate survey={data} question={question} onVote={handleVote} />
      ) : null}
      {!completed && question && question.type === 'text' ? (
        <FreeResponseQuestion survey={data} question={question} onVote={handleVote} />
      ) : null}
      {completed || (!isLoading && questions.length > 0 && questionIndex + 1 > questions.length) ? (
        <CallToAction survey={data} />
      ) : null}
    </SurveyDisplay>
  )
}

const SurveyDisplay = styled.div`
  position: fixed;
  top: 50px;
  width: 100%;
  height: calc(100% - 50px);
  background-size: cover !important;
  overflow: auto;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 3px;
  background: #13537b;
`

interface Progress {
  progress: number
}

const ProgressBarFilled = styled.div<Progress>`
  width: ${(props) => `${props.progress}%`};
  height: 100%;
  background: #30d158;
`

const LogoWrapper = styled.div`
  position: relative;
  width: 100%;
  text-align: center;

  @media (max-width: 429px) {
    display: none;
  }
`

const Logo = styled.img`
  width: 280px;
  vertical-align: middle;
`

const LogoPlaceholder = styled.div`
  height: 80px;

  @media (max-width: 429px) {
    display: none;
  }
`
