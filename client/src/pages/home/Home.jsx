import React, { useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient';

const getData = async () =>{
  const response = await axiosClient('/posts/all');
  const data = response.data;
  console.log(data);
}

const Home = () => {
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>Home</div>
  )
}
export default Home