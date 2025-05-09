import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from 'jwt-decode';

function Feed() {
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [feedList, setFeedList] = useState();
  const [imgList, setImgList] = useState();
  const token = localStorage.getItem("token");
  const sessionUser = jwtDecode(token);

  const fnFeedList = () => {
    fetch("http://localhost:3000/feed")
    .then(res => res.json())
    .then(data => {
      setFeedList(data.list);
    })
  }

  useEffect(()=>{
    fnFeedList();
  }, [])

  const handleClickOpen = (feed) => {

    fetch("http://localhost:3000/feed/" + feed.feed_id)
    .then(res=>res.json())
    .then(data=>{
      setSelectedFeed(data.feed);
      setImgList(data.imgList);
    })

    fetch("http://localhost:3000/feed/" + feed.feed_id + "/comments")
    .then(res=>res.json())
    .then(data=>{
      setComments(data.comments);
    })
    setOpen(true);
    setNewComment('');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]); // 모달 닫을 때 댓글 초기화
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
        fetch("http://localhost:3000/feed/"+selectedFeed?.feed_id+"/comments", {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
              },
              body : JSON.stringify({
                userId : sessionUser.userId,
                comments_content : newComment
              })
        })
        .then(res => res.json())
        .then(data => {
            setComments(prev => [
                ...prev,
                {
                  user_nickname: sessionUser.userNickname,
                  comments_content: newComment
                }
              ]);
              setNewComment('');
        })
    }
  };

  const fnDeleteFeed = (feedId) => {
    fetch("http://localhost:3000/feed/"+feedId, {
        method : "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        fnFeedList();
    })
  };

  const fnDeleteComments = (commentsId) => {
    fetch("http://localhost:3000/feed/"+commentsId, {
        method : "DELETE"
    })
    .then(res => res.json())
  };

  const fnEditFeed = (feedId) => {

  }

  const fnEditComment = (commentsId) => {

  }

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">SNS</Typography>
        </Toolbar>
      </AppBar>

      <Box mt={4}>
        <Grid container spacing={3}>
          {feedList && feedList.map((feed) => (
            <Grid key={feed.feed_id} size={8} >
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={"http://localhost:3000/" + feed.imgPath}
                  alt={feed.feed_title}
                  onClick={() => handleClickOpen(feed)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {feed.user_nickname}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {feed.feed_content}
                  </Typography>
                </CardContent>
                {sessionUser.userId === feed.user_id && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mx: 2, mb: 2 }}>
                    <Button variant="outlined" size="small" onClick={() => fnEditFeed(feed)}>수정</Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => fnDeleteFeed(feed.feed_id)}>삭제</Button>
                </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg"> {/* 모달 크기 조정 */}
        <DialogTitle>
          {selectedFeed?.feed_title}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">{selectedFeed?.user_nickname}</Typography>
            <Typography variant="body1">{selectedFeed?.feed_content}</Typography>
            {imgList && (
              <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
              {imgList.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    src={`${"http://localhost:3000/"+item.imgPath}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
            )}
          </Box>

          <Box sx={{ width: '300px', marginLeft: '20px' }}>
            <Typography variant="h6">댓글</Typography>
            <List>
              {comments.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{comment.user_nickname.charAt(0).toUpperCase()}</Avatar> {/* 아이디의 첫 글자를 아바타로 표시 */}
                  </ListItemAvatar>
                  <ListItemText primary={comment.comments_content} secondary={comment.user_nickname} /> {/* 아이디 표시 */}
                  {sessionUser.userId === comment.user_id && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                        <Button size="small" onClick={() => fnEditComment(index)}>수정</Button>
                        <Button size="small" color="error" onClick={() => fnDeleteComments(comment.comments_id)}>삭제</Button>
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
            <TextField
              label="댓글을 입력하세요"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}           
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              sx={{ marginTop: 1 }}
            >
              댓글 추가
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Feed;