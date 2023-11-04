import React, { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import "./Follower.scss";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";

function Follower({ user, follow }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleFollow = () => {
        dispatch(showToast({
            type: TOAST_SUCCESS,
            message: `${follow === 'followed' ? 'unfollowed' : 'followed'}`
        }))
        dispatch(followAndUnfollowUser({ personId: user._id }));
    }

    return (
        <div className="Follower">
            <div className="user-info" onClick={() => navigate(`/profile/${user._id}`)}>
                <Avatar src={user?.avatar?.url}/>
                <h4 className="name">{user?.name}</h4>
            </div>
            <h5 className={follow === 'followed' ? "hover-link follow-link" : "btn-primary"} onClick={handleFollow}>{follow === 'followed' ? "unfollow" : "follow"}</h5>
        </div>
    );
}

export default Follower;