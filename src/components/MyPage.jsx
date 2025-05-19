import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Avatar, Grid, Paper,
  DialogTitle, DialogContent, Dialog, Button, DialogActions
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import MyFeed from './MyFeed';

function MyPage() {
  const { userId } = useParams();  // URL에서 userId 추출
  const token = localStorage.getItem("token");
  const sessionUser = token ? jwtDecode(token) : null;
  const isMyPage = sessionUser?.userId === userId;

  const [info, setInfo] = useState({ user_nickname: "", user_email: "", intro: ""});
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState();
  const [insertFile, setFile] = useState();
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [feedCnt, setFeedCnt] = useState(0);

  const [imgInfo, setImgInfo] = useState({ img_name : "", img_path : "" });

  const [isFollowing, setIsFollowing] = useState(false);

  console.log("userId", userId);
  console.log("sessionUser", sessionUser.userId);

  const fnUserInfo = (id) => {
    fetch(`http://localhost:3000/user/${id}`)
      .then(res => res.json())
      .then(data => setInfo(data.info));
  };

  const fnGetImg = (id) => {
    fetch(`http://localhost:3000/user/img/${id}`)
    .then(res => res.json())
    .then(data => {
      setImgInfo(data.imgInfo);
      console.log(data);
    });

  }

  const selectImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgUrl(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const fnSave = () => {
    const formData = new FormData();
    formData.append("file", insertFile);
    formData.append("userId", sessionUser.userId);

    fetch("http://localhost:3000/user/upload", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setOpen(false);
        fnUserInfo(sessionUser.userId);
      });
  };

  const fnGetFollower = (id) => {
    fetch(`http://localhost:3000/user/follower/${id}`)
      .then(res => res.json())
      .then(data => setFollower(data.follower));
  };

  const fnGetFollowing = (id) => {
    fetch(`http://localhost:3000/user/following/${id}`)
      .then(res => res.json())
      .then(data => setFollowing(data.following));
  };

  const fnGetFeedCnt = (id) => {
    fetch(`http://localhost:3000/user/feedCnt/${id}`)
      .then(res => res.json())
      .then(data => setFeedCnt(data.count));
  };

  const handleFollowToggle = () => {
    const url = isFollowing
    ? `http://localhost:3000/user/unfollow`
    : `http://localhost:3000/user/follow`;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      followerId: sessionUser.userId,
      followingId: userId
    })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      setIsFollowing(!isFollowing);
      fnGetFollower(userId); // 팔로워 수 갱신
      fnGetFollowing(userId);
    });
  }

  const checkFollowing = () => {
    if (!sessionUser) return;
    fetch(`http://localhost:3000/user/isFollowing?from=${sessionUser.userId}&to=${userId}`)
    .then(res => res.json())
    .then(data => setIsFollowing(data.isFollowing));
  };

  useEffect(() => {
    if (userId) {
      fnUserInfo(userId);
      fnGetImg(userId);
      fnGetFollower(userId);
      fnGetFollowing(userId);
      fnGetFeedCnt(userId);
      if (!isMyPage) checkFollowing();
    }
  }, [userId]);

  useEffect(() => {
  if (sessionUser && userId && sessionUser.userId != userId) {
    checkFollowing();
  }
}, [sessionUser, userId]);

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
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: 3 }}>
            <Avatar
              alt="프로필 이미지"
              src={
                imgInfo.img_name
                  ? `http://localhost:3000/${imgInfo.img_path}${imgInfo.img_name}`
                  : "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
              }
              sx={{ width: 100, height: 100, marginBottom: 2 }}
              onClick={() => isMyPage && setOpen(true)}
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
            <Typography variant="body1">{info.intro}</Typography>
          </Box>
          {!isMyPage && (
  <Box mt={2} textAlign="center">
    <Button
      variant={isFollowing ? "outlined" : "contained"}
      onClick={handleFollowToggle}
    >
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  </Box>
)}
        </Paper>

        {/* 프로필 이미지 수정 다이얼로그 (본인일 때만 표시) */}
        {isMyPage && (
          <Dialog open={open}>
            <DialogTitle>이미지 수정</DialogTitle>
            <DialogContent>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={selectImg}
                />
                <Button variant="contained" component="span">
                  이미지 선택
                </Button>
                {!imgUrl ? "선택된 파일 없음" : "이미지 선택 됨"}
              </label>
            </DialogContent>
            {imgUrl && (
              <Box mt={2} textAlign="center">
                <Typography variant="subtitle1">미리보기</Typography>
                <Avatar src={imgUrl} sx={{ width: 100, height: 100, marginBottom: 2 }} />
              </Box>
            )}
            <DialogActions>
              <Button variant="contained" onClick={fnSave}>저장</Button>
              <Button variant="outlined" onClick={() => { setOpen(false); setImgUrl(null); }}>취소</Button>
            </DialogActions>
          </Dialog>
        )}

        {/* 게시물 리스트 */}
        <MyFeed userId={userId} onFeedChange={() => fnGetFeedCnt(userId)} />
      </Box>
    </Container>
  );
}

export default MyPage;
