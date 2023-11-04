import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosClient } from '../../utils/axiosClient'

export const getFeedData = createAsyncThunk("user/getFeedData",
    async () => {
        try {
            const response = await axiosClient.get('user/getPostsOfFollowing');
            // console.log('userProfile ', response.data.result);
            return response.data.result;
        } catch (error) {
            console.log('error', error);
            return Promise.reject(error);
        }
    });

export const followAndUnfollowUser = createAsyncThunk(
    "user/followAndUnfollow",
    async(body) => {
        try{
            const response = await axiosClient.post('/user/follow', body);
            // console.log('follow response', response);
            return response.data.result.user
        }catch(error){
            console.log('error',error);
            return Promise.reject(error);
        }
    }
);

const feedSlice = createSlice({
    name: 'feedSlice',
    initialState: {
        feedData: {},
    },
    extraReducers: (builder) => {
        builder.addCase(getFeedData.fulfilled, (state, action) => {
            // console.log('feed data ', action.payload);
            state.feedData = action.payload;
        })
        builder.addCase(followAndUnfollowUser.fulfilled, (state, action) => {
            const user = action.payload;
            const index = state?.feedData?.following?.findIndex(item => item._id == user._id);
            if(index != -1){
                state?.feedData.following.splice(index, 1);
            }else{
                state.feedData.following.push(user);
            }
        })
    }
})

export default feedSlice.reducer;