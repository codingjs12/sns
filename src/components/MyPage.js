import {useState, React, useEffect} from 'react';
import { Container, Typography, Box, Avatar, Grid, Paper, DialogTitle, DialogContent, Dialog, Button, DialogActions } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function MyPage() {
  const token = localStorage.getItem("token");
  let [info, setInfo] = useState({user_nickname : "", user_email : "", intro : ""});
  let [open, setOpen] = useState(false);
  let [imgUrl, setImgUrl] = useState();
  let [insertFile, setFile] = useState();
  let [follower, setFollower] = useState(0);
  let [following, setFollowing] = useState(0);
  let [feedCnt, setFeedCnt] = useState(0);
  
  const sessionUser = token ? jwtDecode(token) : null;


  const fnUserInfo = () => {
    if(!token) {
      alert("로그인해주세요.");
      return;
    }
    fetch("http://localhost:3000/user/"+sessionUser.userId)
    .then(res => res.json())
    .then(data => {
      setInfo(data.info);
      console.log(data.info);
    });
  }

  const selectImg = (e) => {
    const file = e.target.files[0];
    if(file) {
      const imgUrl = URL.createObjectURL(file);
      setImgUrl(imgUrl);
      setFile(file);
    }
  }

  const fnSave = () => {
    const formData = new FormData();

    formData.append("file", insertFile);
    formData.append("email", info.email);

    fetch("http://localhost:3000/member/upload", {
      method : "PUT",

      body : formData

    })
    .then(res => res.json(

    ))
    .then(data => {
      console.log(data.result);
      alert(data.message);
      setOpen(false);
      fnUserInfo();
    })
  }

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

  useEffect(()=>{
    if(sessionUser) {
      fnUserInfo();
      fnGetFollower(sessionUser.userId);
      fnGetFollowing(sessionUser.userId);
      fnGetFeedCnt(sessionUser.userId);

    }

  }, [])


  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
        sx={{ padding: '20px' }}
      >
        <Paper elevation={3} sx={{ padding: '20px', borderRadius: '15px', width: '100%' }}>
          {/* 프로필 정보 상단 배치 */}
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: 3 }}>
            <Avatar
              alt="프로필 이미지"
              src={info.profileImg ? "http://localhost:3000/"+info.profileImg : "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"} // 프로필 이미지 경로
              sx={{ width: 100, height: 100, marginBottom: 2 }}
              onClick={()=>{setOpen(!open)}}
            />
            <Typography variant="h5">{info.user_nickname}</Typography>
            <Typography variant="body2" color="text.secondary">
              {info.user_email}
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">팔로워</Typography>
              <Typography variant="body1">{follower}</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">팔로잉</Typography>
              <Typography variant="body1">{following}</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">게시물</Typography>
              <Typography variant="body1">{feedCnt}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6">내 소개</Typography>
            <Typography variant="body1">
              {info.intro}
            </Typography>
          </Box>
        </Paper>
        <Dialog open={open}>
          <DialogTitle>이미지수정</DialogTitle>
          <DialogContent>
            <label>
              <input onChange={selectImg} type="file" accept='image/*' style={{display : "none"}}></input>
              <Button variant='contained' component="span">이미지 선택</Button>
              {!imgUrl ? "선택된 파일 없음" : "이미지 선택 됨"}
            </label>
          </DialogContent>
          {imgUrl && (
            <Box mt = {2}>
            <Typography variant='subtitle1'>미리보기</Typography>
            <Avatar
            alt="미리 보기"
            src={imgUrl} // 프로필 이미지 경로
            sx={{ width: 100, height: 100, marginBottom: 2 }}
            onClick={()=>{setOpen(!open)}}
          />
          </Box>)}
          <DialogActions>
            <Button variant='contained' onClick={()=>{
              fnSave();
            }}>저장</Button>
            <Button variant='outlined' onClick={()=>{
              setOpen(false);
              setImgUrl(null);
            }}>취소</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default MyPage;