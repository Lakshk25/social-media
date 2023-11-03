import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import "./Profile.scss";
import userImg from '../../assets/user.png'
import { useNavigate, useParams } from "react-router";
import CreatePost from '../CreatePost/CreatePost'
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { axiosClient } from "../../utils/axiosClient";


function Profile() {
  const navigate = useNavigate();
  const params = useParams();
  const userProfile = useSelector(state => state.postsReducer.userProfile);
  const myProfile = useSelector(state => state.appConfigReducer.myProfile);
  const [posts, setPosts] = useState([]);
  // console.log(myProfile);
  const dispatch = useDispatch();
  const [isMyProfile, setIsMyProfile] = useState(false);

  const getMyPosts = async () => {
    const allPosts = (await axiosClient('/user/getMyPosts')).data.result.posts;
    // console.log(allPosts);
    return allPosts;
  }
useEffect(() => {
  const fetchData = async () => {
    // Dispatch action to get user profile
    dispatch(getUserProfile({ userId: params.userId }));

    // Set isMyProfile based on the user profile
    setIsMyProfile(myProfile?._id === params.userId);

    // Fetch user posts
    const posts = await getMyPosts();
    setPosts(posts);
  };

  fetchData();
}, [params.userId]);

  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          <CreatePost />
          {posts.map((post) => <Post key={post._id} post={post}/>)}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img className="user-img" src={userProfile?.avatar?.url} alt="" />
            <h3 className="user-name">{userProfile?.name}</h3>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length} Followers`}</h4>
              <h4>{`${userProfile?.following?.length} Following`}</h4>
            </div>
            {!isMyProfile && <button className="follow btn-primary" >Follow</button>}
            {isMyProfile && <button className="update-profile btn-secondary" onClick={() => { navigate('/updateProfile') }}>Update Profile</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;