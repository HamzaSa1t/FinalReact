import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: process.env.VITE_API_URL || 'https://finalreact-nhpx.onrender.com',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log("Request Interceptor - Access Token from localStorage:", token); // Log retrieved access token

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Request Interceptor - Authorization Header set:", config.headers.Authorization); // Log the set header
        }
        return config;
    },
    (error) => {
        console.error("Request Interceptor Error:", error); // Log request setup errors
        return Promise.reject(error);
    }
);

// Flag to ensure page reload only happens once per session for specific errors
let hasReloadedOnceForServerError = false;

api.interceptors.response.use(
    (response) => {
        console.log("Response Interceptor - Successful Response:", response); // Log successful responses
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.error("Response Interceptor - Error:", error); // Log any response error

        // Handle 401 Unauthorized errors (token refresh logic)
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("Response Interceptor - 401 Unauthorized, attempting refresh...");
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
               // console.log("Response Interceptor - Refresh Token from localStorage:", refreshToken); // Log retrieved refresh token

                const refreshResponse = await api.post(
                    '/api/token/refresh/',
                    { refresh: refreshToken }
                );
              //  console.log("Response Interceptor - Refresh Token Response:", refreshResponse); // Log the refresh response

                const { access_token } = refreshResponse.data;
                localStorage.setItem(ACCESS_TOKEN, access_token);
               // console.log("Response Interceptor - New Access Token stored:", access_token); // Log the new stored access token

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
               // console.log("Response Interceptor - Retrying original request with new token:", originalRequest.headers.Authorization); // Log the retry attempt
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Response Interceptor - Refresh Token Error:", refreshError); // Log refresh error
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                // If refresh fails, reject the promise, allowing component to handle or redirect
                return Promise.reject(refreshError);
            }
        }

        // --- Handle 500 or 501 errors by reloading the page once after a delay ---
        if (error.response) {
            const statusCode = error.response.status;
            if ((statusCode === 500 || statusCode === 501) && !hasReloadedOnceForServerError) {
                console.log(`Detected server error (${statusCode}). Page will reload in 3 seconds.`);
                hasReloadedOnceForServerError = true; // Set flag to prevent future reloads in this session

                // Set a timeout for the page reload
                setTimeout(() => {
                    window.location.reload(); // Reload the entire page
                }, 3000); // 3-second delay

                // IMPORTANT: Return a Promise that never resolves or rejects.
                // This prevents the error from propagating further to component's catch blocks,
                // as the page is about to reload anyway.
                return new Promise(() => {});
            }
        }

        // For any other errors (e.g., 4xx other than 401, network errors, or if already reloaded for 5xx)
        // re-throw the error so that individual components can handle them if needed.
        return Promise.reject(error);
    }
);

export default api;