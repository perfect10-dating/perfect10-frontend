import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TopBarState {
    middleContent: any | undefined;
}

const initialState: TopBarState = {
    middleContent: undefined,
}

export const topBarSlice = createSlice({
    name: 'topBar',
    initialState,
    reducers: {
        setMiddleContent: (
            state,
            action: PayloadAction<{middleContent: any}>) => {
            console.log(action.payload.middleContent)
            state.middleContent = action.payload.middleContent
        }
    }
})

export const {
    setMiddleContent
} = topBarSlice.actions
export default topBarSlice.reducer