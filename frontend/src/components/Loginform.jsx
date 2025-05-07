import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/form.css"
import LoadingIndicator from "./LoadingIndicator";
import { Link } from 'react-router-dom';


function LoginForm({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [UserType, setUserType] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        setLoading(true);
        e.preventDefault();
        setErrorMessage("");

        try {
            const res = await api.post("api/user/signin/", { username, password })
            console.log("Login successed!");

            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/")
        } catch (error) {
            alert(error)
            console.log("Login Error:", error); 
            setErrorMessage("Login failed: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false)
        }
    };

    return (
<div>

        <form onSubmit={handleLogin} className="form-container">
            <h1>Login</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            /> 
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                Login
            </button>
            <p> <Link to="/register"> Register </Link> </p>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>

        </div>
    );
}

export default LoginForm