import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";

export const getUserProfile = createAsyncThunk(
    "user/getUserProfile",
    async (body, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading(true));
            // console.log('body -> ', body);
            const response = await axiosClient.post('/user/getUserProfile', body);
            // console.log('user profile -> ', response);
            return response.data.result
        } catch (error) {
            return Promise.reject;
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

const postsSlice = createSlice({
    name: 'postsSlice',
    initialState: {
        userProfile: {}
    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.userProfile = action.payload;
        })
    }
});

export default postsSlice.reducer;