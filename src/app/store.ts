import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import userReducer from '../services/userSlice'
import topBarReducer from '../services/topBarSlice'
import { api } from '../services/api'
import {authSlice} from "../services/authSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    topBar: topBarReducer,
    auth: authSlice.reducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;