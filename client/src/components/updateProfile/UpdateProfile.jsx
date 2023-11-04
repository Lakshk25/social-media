import React, { useEffect, useState } from 'react';
import './UpdateProfile.scss';
import { useSelector, useDispatch } from 'react-redux';
import { showToast, updateMyProfile } from '../../redux/slices/appConfigSlice';
import { TOAST_SUCCESS } from '../../App';
import toast, { Toaster } from 'react-hot-toast';


function UpdateProfile() {
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [userImg, setUserImg] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setName(myProfile?.name || '');
        setBio(myProfile?.bio || '');
        setUserImg(myProfile?.avatar?.url || '');
    }, [myProfile, dispatch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setUserImg(fileReader.result)
                // console.log('img data', fileReader.result);
            }
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateMyProfile({
            name,
            bio,
            userImg
        }));
        dispatch(showToast({
            type: TOAST_SUCCESS,
            message: "Profile updated"
        }))

    }
    return (
        <div className="UpdateProfile">
            <div className="container">
                <div className="left-part">
                    <div className="input-user-img">
                        <label htmlFor="inputImg" className='labelImg'><img src={userImg} alt={name} /></label>
                        <input type="file" id='inputImg' accept='image/*' onChange={handleImageChange} className="inputImg" />
                    </div>
                </div>
                <div className="right-part">
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={name} placeholder='Your Name' onChange={(e) => setName(e.target.value)} />
                        <input type="text" value={bio} placeholder='Your Bio' onChange={(e) => setBio(e.target.value)} />
                        <input type="submit" className="btn-primary" onClick={handleSubmit} />
                    </form>
                    <button className='delete-account btn-primary'>Delete Account</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfile