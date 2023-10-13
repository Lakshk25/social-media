import axios from "axios";
import {
    getItem,
    KEY_ACCESS_TOKEN,
    removeItem,
    setItem,
} from "./localStorageManager";

const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

// Create a base Axios Client
const axiosClient = axios.create({
    baseURL: apiURL,
    withCredentials: true,  // with cookies
});

// add bearer to request bearer (access token added from local storage)
axiosClient.interceptors.request.use((request) => {
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    console.log('this is fuck key -> ',getItem(KEY_ACCESS_TOKEN))
    if (accessToken) {
        request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
});

// interceptor for axpiration of access token and refresh token
axiosClient.interceptors.response.use(async (response) => {
    const data = response.data;
    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.error;
    setItem(KEY_ACCESS_TOKEN, data.result.accessToken);

    console.log('Response Interceptor');
    console.log('response data -> ', data);
    console.log(`Status Code: ${statusCode}`);
    console.log(`Request URL: ${originalRequest.url}`);

    if (statusCode === 401) {
        // refresh token expires
        if (originalRequest.url === `${apiURL}/api/refresh`) {
            console.log('refresh token expired');
            removeItem(KEY_ACCESS_TOKEN);
            window.location.replace("/login", "_self");
            return Promise.reject(error);
        }
        // access token expires
        else if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Send a request to refresh the access token
                const refreshResponse = await axiosClient.get('/api/refresh', {
                    withCredentials: true, // Include cookies in the request
                });
                const refreshData = refreshResponse.data;

                console.log('Access Token Refresh Response', refreshData);

                if (refreshData.status === "ok") {
                    setItem(KEY_ACCESS_TOKEN, refreshData.result.accessToken);
                    originalRequest.headers["Authorization"] = `Bearer ${refreshData.result.accessToken}`;
                    return axiosClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('Access Token Refresh Error:', refreshError);
                return Promise.reject(refreshError);
            }
        }
    }

    return Promise.reject();
},
    (error) => {
        console.error("Axios Error:", error);
        return Promise.reject(error);
    }
);

export { axiosClient };
