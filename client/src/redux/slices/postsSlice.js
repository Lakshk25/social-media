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

export const likeUnlikePost = createAsyncThunk(
    "posts/like",
    async (body) => {
        try {
            const response = await axiosClient.post("/posts/like", body);
            console.log('like response ',response.data.result);
            return response.data.result;
        } catch (error) {
            console.log('error ', error);
            return Promise.reject(error);
        }
    }
)

const postsSlice = createSlice({
    name: 'postsSlice',
    initialState: {
        userProfile: {}
    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.userProfile = action.payload;
        })
        builder.addCase(likeUnlikePost.fulfilled, (state, action) => {
            const post = action.payload;
            console.log('user profile',state.userProfile)
            const index = state?.userProfile?.posts?.findIndex((item) => item._id === post._id);
            if(index !== undefined && index !== -1){
                state.userProfile.posts[index] = post;
            }
        });
    }
});

export default postsSlice.reducer;