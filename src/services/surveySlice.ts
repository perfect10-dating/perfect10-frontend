import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SurveyState {
  type: 'linear' | 'flowchart'
  questions: Question[]
  flowchartEdges: any
  navbarImageUrl: string
  desktopImageUrl: string
  questionIndex: number
  viewed: boolean
  started: boolean
  completed: boolean
}

const initialState: SurveyState = {
  type: 'linear',
  questions: [],
  flowchartEdges: {},
  navbarImageUrl: '',
  desktopImageUrl: '',
  questionIndex: 0,
  viewed: false,
  started: false,
  completed: false,
}

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    vote: (state, action: PayloadAction<number>) => {
      //Action Payload
      if (state.type === 'flowchart') {
        let nextQuestionId = state.flowchartEdges[state.questions[state.questionIndex]._id + ''][action.payload]
        let nextQuestionIndex = state.questions.indexOf(nextQuestionId)
        state.questionIndex = nextQuestionIndex
      } else {
        state.questionIndex += 1
      }
    },
    setSurveyData: (
      state,
      action: PayloadAction<{
        type: 'linear' | 'flowchart'
        questions: Question[]
        flowchartEdges: any
        navbarImageUrl: string
        desktopImageUrl: string
      }>
    ) => {
      state.type = action.payload.type || 'linear'
      state.questions = action.payload.questions
      state.flowchartEdges = action.payload.flowchartEdges
      state.navbarImageUrl = action.payload.navbarImageUrl
      state.desktopImageUrl = action.payload.desktopImageUrl
    },
    setViewed: (state) => {
      state.viewed = true
    },
    setStarted: (state) => {
      state.started = true
    },
    setCompleted: (state) => {
      state.completed = true
    },
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload
    },
  },
})

export const { vote, setSurveyData, setViewed, setStarted, setCompleted, setQuestionIndex } = surveySlice.actions
export default surveySlice.reducer
