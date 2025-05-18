import { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Avatar, 
    Grid, 
    Paper, 
    DialogTitle, 
    DialogContent, 
    Dialog, 
    Button, 
    DialogActions
} from '@mui/material';

function Info() {



  const fnGetFollowing = (userId) => {
    fetch("http://localhost:3000/user/following/"+userId)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setFollowing(data.following);
    })
  }
  const fnGetFollower = (userId) => {
    fetch("http://localhost:3000/user/follower/"+userId)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setFollower(data.follower);
    })
  }

  const fnGetFeedCnt = (userId) => {
    fetch("http://localhost:3000/user/feedCnt/" +userId)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setFeedCnt(data.count);
    })
  }

    const fnUserInfo = () => {
    fetch("http://localhost:3000/user/"+userId)
    .then(res => res.json())
    .then(data => {
      setInfo(data.info);
      console.log(data.info);
    });
  }

    useEffect(()=>{
        fnUserInfo();
        fnGetFollower(userId);
        fnGetFollowing(userId);
        fnGetFeedCnt(userId);
      
  
    }, [])

    return (
        <>
        </>
    )

}

export default Info;