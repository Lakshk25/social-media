import React, { useEffect, useState } from 'react'
import Avatar from '../avatar/Avatar'
import './Post.scss'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import { likeUnlikePost } from '../../redux/slices/postsSlice'
import { useDispatch } from 'react-redux'

function Post({post}) {
    const dispatch = useDispatch();
    // console.log('post ',post);
    const [isLiked, setisLiked] = useState(post.isLiked)

    const handleLike = async () => {
        setisLiked(post.isLiked);
        dispatch(likeUnlikePost({postId : post._id}));
    }
    useEffect(() => {
        
    }, [isLiked, dispatch]);
  return (
    <div className="Post">
        <div className="heading">
            <Avatar />
            <h4>{post?.owner.name}</h4>
        </div>
        <div className="content">
            <img src={post?.image?.url} alt="" />
        </div>
        <div className="footer">
            <div className="like" onClick={handleLike}>
            {isLiked ? <AiFillHeart style={{color: 'red'}} className="icon" /> : <AiOutlineHeart className="icon" />}
                <h4>{`${post?.likesCount} likes`}</h4>
            </div>
            <p className="caption">{post.caption ? post.caption : ' '}</p>
            <h6 className="time-ago">{post.timeAgo}</h6>
        </div>
    </div>
  )
}

export default Post