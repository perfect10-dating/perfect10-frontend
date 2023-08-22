import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    user?: User
    currentRoom?: Room
    dates: Date[]
    hasUpdatedLocation: boolean
}

const initialState: UserState = {
    dates: [],
    hasUpdatedLocation: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // call after we open the app for the first time
    setUser: (
      state,
      action: PayloadAction<{
        user?: User
      }>
    ) => {
        console.log(action.payload.user)
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
          dates: Date[]
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
    },

    // tell the store that we've collected location
    setHasCollectedLocation: (
        state,
        action: PayloadAction<{hasUpdatedLocation: boolean}>
    )=> {
        state.hasUpdatedLocation = action.payload.hasUpdatedLocation
    }
  },
})

export const { setUser, setRoom,
    setDates, addDate , setHasCollectedLocation
} = userSlice.actions
export default userSlice.reducer
