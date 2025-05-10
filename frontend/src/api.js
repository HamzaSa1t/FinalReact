import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: "https://finalreact-nhpx.onrender.com",
    withCredentials: true,  
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!config.url.includes("/register") && !config.url.includes("user/signin/") && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for POST, PUT, PATCH, DELETE requests
        if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
            const csrfToken = Cookies.get('csrftoken');
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;