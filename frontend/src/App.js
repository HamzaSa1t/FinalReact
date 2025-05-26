/* import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/register';
import AddProduct from './components/AddProduct';
import ViewProduct from './pages/ViewProduct';
import EditProduct from './pages/EditProduct';
import Basket from './pages/Basket';
import Charge from './pages/charge';
import EmployeeHistory from './pages/employeeHistory';
import Dashboard from './pages/dashboard';
import Tail from './components/Tail'; // Import Tail component
import notFound from './pages/NotFound'; // Import notFound component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/ViewProduct/:pk" element={<ViewProduct />} />
        <Route path="/EditProduct/:pk" element={<EditProduct />} />
        <Route path="/Basket/:pk" element={<Basket />} />
        <Route path="/Charge" element={<Charge />} />
        <Route path="/EmployeeHistory" element={<EmployeeHistory />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/notFound" element={<notFound />} />
      </Routes>
      <Tail /> {/* Add Tail component here if you want it on every route 
    </Router>
  );
}

export default App;


-----------------------------------------------------

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

api.interceptors.response.use(
  (response) => {
    console.log("Response Interceptor - Successful Response:", response); // Log successful responses
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error("Response Interceptor - Error:", error); // Log any response error

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Response Interceptor - 401 Unauthorized, attempting refresh...");
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        console.log("Response Interceptor - Refresh Token from localStorage:", refreshToken); // Log retrieved refresh token

        const refreshResponse = await api.post(
          '/api/token/refresh/',
          { refresh: refreshToken }
        );
        console.log("Response Interceptor - Refresh Token Response:", refreshResponse); // Log the refresh response

        const { access_token } = refreshResponse.data;
        localStorage.setItem(ACCESS_TOKEN, access_token);
        console.log("Response Interceptor - New Access Token stored:", access_token); // Log the new stored access token

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        console.log("Response Interceptor - Retrying original request with new token:", originalRequest.headers.Authorization); // Log the retry attempt
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Response Interceptor - Refresh Token Error:", refreshError); // Log refresh error
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        //console.log("Response Interceptor - Tokens removed, redirecting to /login"); // Log token removal and redirection
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
 */