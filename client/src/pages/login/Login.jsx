import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem, getItem } from "../../utils/localStorageManager";
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const response = axiosClient.post('/api/login',{
                email:email,
                password:password
            })
            const data = (await response).data;
            if(data.status === 'ok'){
                dispatch(showToast({
                    type: TOAST_SUCCESS,
                    message: 'Login Successfully'
                }))
                setItem(KEY_ACCESS_TOKEN ,data.result[KEY_ACCESS_TOKEN]);
                navigate('/');
            }
            else{
                dispatch(showToast({
                    type: TOAST_FAILURE,
                    message: data.message
                }))
            }
        }catch(error){
            dispatch(showToast({
                type: TOAST_FAILURE,
                message: error.message
            }))
            console.log('login failed ', error);
        }
    }

    return (
        <div className="Login">
            <div className="login-box">
                <h2 className="heading">Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input type="submit" className="submit" />
                </form>
                <p className="subheading">
                    Do not have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
