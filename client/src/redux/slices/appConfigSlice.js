import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from '../../utils/axiosClient'

export const getMyInfo = createAsyncThunk(
    "user/getMyInfo", async (_, thunkApi) => {
        try {
            // console.log("thunk api -> ", thunkApi)
            thunkApi.dispatch(setLoading(true));
            const response = await axiosClient.get('/user/getMyInfo'); 
            return response.data.result;
        } catch (error) {
            return Promise.reject(error);
        } finally {
            thunkApi.dispatch(setLoading(false));
        }
    }
);

export const updateMyProfile = createAsyncThunk(
    "user/updateMyProfile",
    async (body, thunkApi) => {
        try {
            thunkApi.dispatch(setLoading(true));
            const response = await axiosClient.put('/user/', body);
            return response.data.result
        } catch (error) {
            return Promise.reject(error);
        } finally {
            thunkApi.dispatch(setLoading(false));
        }
    }
)

const appConfigSlice = createSlice({
    name: "appConfigSlice",
    initialState: {
        isLoading: false,
        myProfile: null,
        toastData: {},
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        showToast: (state, action) => {
            state.toastData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyInfo.fulfilled, (state, action) => {
            // console.log('action => ', action);
            state.myProfile = action.payload.user;
            // console.log('my profile set ',state.myProfile);
        })
        builder.addCase(updateMyProfile.fulfilled, (state, action) => {
            state.myProfile = action.payload.user;
        });
    },
});

export default appConfigSlice.reducer;

export const {setLoading, showToast} = appConfigSlice.actions;

