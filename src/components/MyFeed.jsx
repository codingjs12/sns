import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
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
  Stack,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from 'jwt-decode';

function MyFeed({onFeedChange}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [feedList, setFeedList] = useState();
  const [imgList, setImgList] = useState();
  const token = localStorage.getItem("token");
  const sessionUser = jwtDecode(token);
  const [parentId, setParentId] = useState(null);
  const [replyTo, setReplyTo] = useState(null); // 대댓글 입력할 댓글 ID
  const [replyContent, setReplyContent] = useState(''); // 대댓글 내용

  const [editOpen, setEditOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editFeedId, setEditFeedId] = useState(null);
  
  const [files, setFiles] = useState([]); 
  const [previews, setPreviews] = useState([]);

  const fnFeedList = () => {
    fetch("http://localhost:3000/feed")
    .then(res => res.json())
    .then(data => {
      setFeedList(data.list);
    })

    fetch("http://localhost:3000/feed/img")
    .then(res => res.json())
    .then(data => {
      setImgList(data.imgList);
    })
  }

  useEffect(()=>{
    fnFeedList();
  }, [])

  const fnGetComments = (feed) => {
    fetch("http://localhost:3000/feed/" + feed.feed_id + "/comments")
    .then(res=>res.json())
    .then(data=>{
      const commentList = data.comments || [];
      const tree = buildCommentTree(commentList);
      setComments(tree);
    })
  }
  const handleClickOpen = (feed) => {

    fetch("http://localhost:3000/feed/" + feed.feed_id)
    .then(res=>res.json())
    .then(data=>{
      setSelectedFeed(data.feed);
    })
    fnGetComments(feed);
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
                comments_content : newComment,
                parent_id : parentId
              })
        })
        .then(res => res.json())
        .then(data => {
          setNewComment('');
          setParentId(null);
          fnGetComments(selectedFeed);
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
        if (onFeedChange) onFeedChange();
    })
  };

  const fnDeleteComments = (commentsId) => {
    fetch("http://localhost:3000/feed/"+commentsId +"/comments", {
        method : "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      fnGetComments(selectedFeed);
      
    })
  };

  const fnEditFeed = (feed) => {
    setEditOpen(true);
    setEditTitle(feed.feed_title);
    setEditContent(feed.feed_content);
    setEditFeedId(feed.feed_id);
    fnGetImg(feed.feed_id);
  }

  const fnEditComment = (commentsId) => {

  }

  const buildCommentTree = (flatComments) => {
    const commentMap = {};
    const tree = [];

    flatComments.forEach(comment => {
      comment.children = []; // 대댓글을 담을 배열 추가
      commentMap[comment.comments_id] = comment;
    });

    flatComments.forEach(comment => {
      if (comment.parent_comments_id) {
        // 대댓글이면 부모에 추가
        const parent = commentMap[comment.parent_comments_id];
        if (parent) {
          parent.children.push(comment);
        }
      } else {
        // 일반 댓글이면 트리에 추가
        tree.push(comment);
      }
    });

    return tree;
  };
  const renderComment = (comment, depth = 0) => (
  <Box key={comment.comments_id} sx={{ pl: depth * 4, mt: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ListItemAvatar>
        <Avatar>{comment.user_nickname.charAt(0).toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={comment.is_deleted == 'Y' ? "삭제된 댓글입니다." : comment.comments_content}
        secondary={comment.user_nickname}
      />
      {sessionUser.userId === comment.user_id && (comment.is_deleted == 'N' || isAllChildrenDeleted(comment)) && (
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
          <Button size="small" onClick={() => fnEditComment(comment.comments_id)}>수정</Button>
          <Button size="small" color="error" onClick={() => fnDeleteComments(comment.comments_id)}>삭제</Button>
        </Box>
      )}
    </Box>

    <Box sx={{ mt: 1, pl: 7 }}>
      <Button variant="outlined" size="small" onClick={() => setReplyTo(comment.comments_id)}>
        댓글 달기
      </Button>
      {replyTo === comment.comments_id && (
        <Box sx={{ mt: 1 }}>
          <TextField
            label="대댓글 입력"
            variant="outlined"
            fullWidth
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              fetch(`http://localhost:3000/feed/${selectedFeed.feed_id}/comments`, {
                method: "POST",
                headers: {
                  "Content-type": "application/json"
                },
                body: JSON.stringify({
                  userId: sessionUser.userId,
                  comments_content: replyContent,
                  parent_id: replyTo
                })
              })
              .then(res => res.json())
              .then(() => {
                fnGetComments(selectedFeed); // 댓글 새로고침
                setReplyTo(null);
                setReplyContent('');
              });
            }}
            sx={{ mt: 1 }}
          >
            등록
          </Button>
        </Box>
      )}
    </Box>

    {comment.children && comment.children.map(child => renderComment(child, depth + 1))}
  </Box>
);

const isAllChildrenDeleted = (comment) => {
  if (!comment.children || comment.children.length === 0) return true;
  return comment.children.every(child => child.is_deleted === 'Y');
};

const handleEditSubmit = () => {
  fetch(`http://localhost:3000/feed/${editFeedId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      feed_title: editTitle,
      feed_content: editContent
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    setEditOpen(false);
    fnFeedList(); // 피드 목록 새로고침
  });
};

  // 개별 미리보기 제거
  const handleRemove = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

    // 파일 선택 시
  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files);
    setFiles(chosen);
    // URL 생성
    setPreviews(chosen.map(file => URL.createObjectURL(file)));
  };

  const fnGetImg = (feedId) => {
    fetch("http://localhost:3000/feed/img", {
      method:"POST",
      headers : {"Content-Type": "application/json"},
      body : JSON.stringify({ feedId })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.list);
      const imageUrls = data.list.map(img => `http://localhost:3000/${img.img_path}${img.img_name}`);
      setFiles(data.list);
      setPreviews(imageUrls);
    })
  }

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Grid container spacing={3}>
          {feedList && feedList.filter(feed => feed.user_id === sessionUser.userId)
          .map((feed) => {
            const matchedImg = imgList?.find(img => img.target_id === feed.feed_id);

            return (
              <Grid key={feed.feed_id} size={8} >
                <Card>
                {matchedImg ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:3000/${matchedImg.img_path}${matchedImg.img_name}`}
                    alt={feed.feed_title}
                    onClick={() => handleClickOpen(feed)}
                    style={{ cursor: 'pointer' }}
                  /> ) : (
                  <Box
                    height="200px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="#f0f0f0"
                    onClick={() => handleClickOpen(feed)}
                    style={{ cursor: 'pointer' }}
                  >
                  <Typography variant="body2" color="textSecondary">
                    이미지 없음
                  </Typography>
                  </Box>
                )}
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
          )})}
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
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">{selectedFeed?.user_nickname}</Typography>
            <Typography variant="body1">{selectedFeed?.feed_content}</Typography>
            {imgList && (
              <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
              {imgList.filter(item => item.target_id === selectedFeed?.feed_id).map((item) => (
                <ImageListItem key={item.img_id}>
                  <img
                    src={`${"http://localhost:3000/"+item.img_path+item.img_name}`}
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
              {comments.map(comment => renderComment(comment))}
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

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>피드 수정</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="제목"
            type="text"
            fullWidth
            variant="outlined"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="내용"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="primary">
            취소
          </Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">
            수정 완료
          </Button>
        </DialogActions>

        {/* 파일 선택 버튼 */}
        <Box display="flex" alignItems="center" mt={2}>
          <input
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
          <label htmlFor="file-upload">
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography variant="body1" ml={1}>
            {files.length > 0 ? `${files.length}개 선택됨` : '첨부할 파일 선택'}
          </Typography>
        </Box>

        {/* 이미지 미리보기 */}
        {previews.length > 0 && (
          <Stack direction="row" flexWrap="wrap" mt={2} spacing={1}>
            {previews.map((src, idx) => (
              <Box key={idx} position="relative">
                <Avatar
                  variant="rounded"
                  src={src}
                  sx={{ width: 80, height: 80 }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemove(idx)}
                  sx={{
                    position: 'absolute',
                    top: -6, right: -6,
                    bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
      </Dialog>
    </Container>
  );
}

export default MyFeed;