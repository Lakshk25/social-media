import React, { useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient';

const Home = () => {
  const postsFunc = async () => {

    try {
      console.log('req call from home');
      const response = await axiosClient.get('/posts/all');
      console.log('home data -> ', response);
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.log('home -> error', error);
    }
  }
  useEffect(() => {
    // postsFunc();
  }, []);
  return (
    <div>Home</div>
  )
}

export default Home