import React, {useState} from 'react'
import Avatar from '../avatar/Avatar'
import './CreatePost.scss'
import {BsCardImage} from 'react-icons/bs'
import { axiosClient } from '../../utils/axiosClient'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, showToast } from '../../redux/slices/appConfigSlice'
import { getUserProfile } from '../../redux/slices/postsSlice'
import { TOAST_SUCCESS } from '../../App'

const CreatePost = () => {
    const [postImg, setPostImg] = useState("");
    const [caption, setCaption] = useState("");
    const dispatch = useDispatch();
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setPostImg(fileReader.result)
                // console.log('img data', fileReader.result);
            }
        }
    }

    const handlePostSubmit = async() => {
        try{
            dispatch(setLoading(true));
            await axiosClient.post('/posts', {
                caption,
                postImg
            });
            dispatch(getUserProfile({userId : myProfile?._id}));
        }catch(error){
            console.log('error in handle submit ',error);
        }finally{
            dispatch(setLoading(false));
            setCaption('');
            setPostImg('');
        }
        dispatch(showToast({
            type: TOAST_SUCCESS,
            message: 'post created'
        }))
    }
  return (
    <div className='CreatePost'>
        <div className="left-part">
            <Avatar/>
        </div>
        <div className="right-part">
            <input type="text" value={caption} className='captionInput' placeholder= "What's on your mind?" onChange={(e) => setCaption(e.target.value)}/>
            {postImg && (
                <div className="img-container">
                    <img src={postImg} alt="post-img" className="post-img" />
                </div>
            )}

            <div className="bottom-part">
                <div className="input-post-img">
                    <label htmlFor="inputImg" className='labelImg'>
                        <BsCardImage/>
                    </label>
                    <input className='inputImg' id='inputImg' type='file' accept='image/*' onChange={handleImageChange} />
                </div>
                <button className="post-btn btn-primary" onClick={handlePostSubmit}>Post</button>
            </div>
        </div>
    </div>
  )
}

export default CreatePost