import {configureStore} from '@reduxjs/toolkit'
import appConfigReducer from './slices/appConfigSlice'
import feedDataReducer from './slices/feedSlice'
import postsReducer from './slices/postsSlice'

export default configureStore({
    reducer : {
        appConfigReducer,
        postsReducer,
        feedDataReducer,
    }
})