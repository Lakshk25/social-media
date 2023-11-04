import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router";
import Avatar from "../avatar/Avatar";
import "./Navbar.scss";
import { useSelector, useDispatch } from "react-redux";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";


function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile );
    const handleLogoutClicked = (e) => {
        dispatch(showToast({
            type: TOAST_SUCCESS,
            message: 'Logged out'
        }))
        e.preventDefault();
        removeItem(KEY_ACCESS_TOKEN);
        navigate('/login');
    }
    return (
        <div className="Navbar">
            <div className="container">
                <h2 className="banner hover-link" onClick={() => navigate("/")}>
                    Social Media
                </h2>
                <div className="right-side">
                    <div
                        className="profile hover-link"
                        onClick={() => navigate(`/profile/${myProfile._id}`)}
                    >
                        <Avatar src={myProfile?.avatar?.url} />
                    </div>
                    <div className="logout hover-link" onClick={handleLogoutClicked}>
                        <AiOutlineLogout />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;