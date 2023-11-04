import axios from "axios";
import {
    getItem,
    KEY_ACCESS_TOKEN,
    removeItem,
    setItem,
} from "./localStorageManager";
import store from '../redux/store'
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";

const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

// Create a base Axios Client
const axiosClient = axios.create({
    baseURL: apiURL,
    withCredentials: true,  // with cookies
});

axiosClient.interceptors.request.use((request) =>{
    try{
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    if(accessToken){
        request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
    }catch(error){
        console.log('request interceptor error ', error);
        return Promise.reject(error);
    }
})

axiosClient.interceptors.response.use(async (response) =>{
    try{
        const data = response.data;
        const statusCode = response.data.statusCode;
        const config = response.config;

        if(statusCode === 401){
            console.log('expired');
            if(config.url == '/api/refresh'){
                console.log('refresh expired');
                console.log('refresh token expired');
                removeItem(KEY_ACCESS_TOKEN);
                window.location.replace("/login", "_self");
            }
            const refreshResponse = await axiosClient('/api/refresh');
            const data = refreshResponse.data;
            setItem(KEY_ACCESS_TOKEN,data.result[KEY_ACCESS_TOKEN]);
        }
        return response;
        }catch(error){
            console.log('response interceptor error ', error);
            store.dispatch(showToast({
                type: TOAST_FAILURE,
                message: error.message
            }))
            return Promise.reject(error);
        }
})

export { axiosClient };
