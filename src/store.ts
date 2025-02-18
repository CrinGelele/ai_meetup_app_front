import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { speakersReducer } from "./slices/speakersSlice"
import { useDispatch } from 'react-redux';
import userReducer from './slices/usersSlice'; 
import { meetupsReducer } from './slices/meetupsSlice'
import { meetupssReducer } from './slices/meetupssSlice'


export const store = configureStore({
    reducer: combineReducers({
        speakers: speakersReducer,
        user: userReducer,
        meetup: meetupsReducer,
        meetups: meetupssReducer,
    })
})

export type RootState = ReturnType<typeof store.getState>;

// Тип для dispatch с поддержкой thunk
export type AppDispatch = typeof store.dispatch;

// Кастомный хук useAppDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();