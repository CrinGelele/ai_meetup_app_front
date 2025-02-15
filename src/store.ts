import { combineReducers, configureStore } from "@reduxjs/toolkit"
import dataReducer from "./slices/speakersSlice"


export default configureStore({
    reducer: combineReducers({
        filter: dataReducer
    })
})