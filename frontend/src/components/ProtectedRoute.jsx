import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
      //  console.log("ProtectedRoute: useEffect triggered");
        auth().catch((error) => {
            console.error("ProtectedRoute: auth function error:", error);
            setIsAuthorized(false);
        });
    }, []);

    const refreshToken = async () => {
       // console.log("ProtectedRoute: refreshToken function called");
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      //  console.log("ProtectedRoute: Retrieved refreshToken from localStorage:", refreshToken);
        try {
           // console.log("ProtectedRoute: Attempting to refresh token via API");
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            console.log("ProtectedRoute: Refresh token API response:", res);
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
               // console.log("ProtectedRoute: New accessToken stored in localStorage:", res.data.access);
                setIsAuthorized(true);
            } else {
                console.log("ProtectedRoute: Refresh token API failed with status:", res.status);
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error("ProtectedRoute: Error during refresh token API call:", error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
      //  console.log("ProtectedRoute: auth function called");
        const token = localStorage.getItem(ACCESS_TOKEN);
      //  console.log("ProtectedRoute: Retrieved accessToken from localStorage:", token);
        if (!token) {
            console.log("ProtectedRoute: No accessToken found, setting isAuthorized to false");
            setIsAuthorized(false);
            return;
        }
        try {
            const decoded = jwtDecode(token);
     //       console.log("ProtectedRoute: Decoded accessToken:", decoded);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;
       //     console.log("ProtectedRoute: Token expiration:", tokenExpiration, "Current time:", now);

            if (tokenExpiration < now) {
                console.log("ProtectedRoute: Access token has expired, calling refreshToken");
                await refreshToken();
            } else {
         //       console.log("ProtectedRoute: Access token is valid, setting isAuthorized to true");
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error("ProtectedRoute: Error decoding access token:", error);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
       // console.log("ProtectedRoute: isAuthorized is null, rendering Loading...");
        return <div>Loading...</div>;
    }

   // console.log("ProtectedRoute: isAuthorized state:", isAuthorized);
    return isAuthorized ? children : <Navigate to="/register" />;
}

export default ProtectedRoute;