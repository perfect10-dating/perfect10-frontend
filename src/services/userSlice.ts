import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  user?: User
  currentRoom?: Room
  dates: [Date?]
}

const initialState: UserState = {
  dates: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // call after we open the app for the first time
    setUser: (
      state,
      action: PayloadAction<{
        user: User
      }>
    ) => {
      state.user = action.payload.user
    },

    // call when we load a room to be viewed
    setRoom: (
        state,
        action: PayloadAction<{
          currentRoom: Room
        }>
    ) => {
      state.currentRoom = action.payload.currentRoom
    },

    // call when we load a room to be viewed
    setDates: (
        state,
        action: PayloadAction<{
          dates: [Date]
        }>
    ) => {
      state.dates = action.payload.dates
    },

    // call when we add a new date to the list
    addDate: (
        state,
        action: PayloadAction<{
          date: Date
        }>
    ) => {
      state.dates.push(action.payload.date)
    }
  },
})

export const { setUser, setRoom, setDates, addDate } = userSlice.actions
export default userSlice.reducer
