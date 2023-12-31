import React, { useEffect } from 'react'
import Follower from '../follower/Follower'
import Post from '../post/Post'
import './Feed.scss'
import {useDispatch, useSelector} from 'react-redux'
import { getFeedData } from '../../redux/slices/feedSlice'


function Feed() {
  const dispatch = useDispatch();
  const feedData = useSelector(state => state.feedDataReducer.feedData);

  useEffect(() => {
    dispatch(getFeedData());
  }, [dispatch, feedData])
  
  return (
    <div className="Feed">
        <div className="container">
          <div className="left-part">
            {feedData?.posts?.map(post => <Post key={post._id} post={post}/>)}
          </div>
          <div className="right-part">
            <div className="following">
              <h3 className="title">You Are Following</h3>
              {feedData?.following?.map((user) => <Follower key={user._id} follow={'followed'} user={user}/>)}
            </div>
            <div className="suggestions">
              <h3 className="title">Suggested For You</h3>
              {feedData?.suggestions?.map((user) => <Follower key={user._id} follow={'unfollowed'} user={user}/>)}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Feed