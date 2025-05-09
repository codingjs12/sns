import React ,{useState, useRef} from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';

function Register() {
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);

  const sessionUser = jwtDecode(token);
  let titleRef = useRef();
  let contentRef = useRef();


  const addFeed = () => {

    fetch("http://localhost:3000/feed", {
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify({
        userId : sessionUser.userId,
        title : titleRef.current.value,
        content : contentRef.current.value
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      // fnUploadFile(data.result.insertId);
    })
  }

  const handleFileChange = (event) => {
    setFile(event.target.files);
  };

  const fnUploadFile = (feedId)=>{
    const formData = new FormData();
    for(let i=0; i<file.length; i++){
      formData.append("file", file[i]); 
    } 
    formData.append("feedId", feedId);
    fetch("http://localhost:3000/feed/upload", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // navigate("/feed"); // 원하는 경로
    })
    .catch(err => {
      console.error(err);
    });
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start" // 상단 정렬
        minHeight="100vh"
        sx={{ padding: '20px' }} // 배경색 없음
      >
        <Typography variant="h4" gutterBottom>
          등록
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>카테고리</InputLabel>
          <Select defaultValue="" label="카테고리">
            <MenuItem value={1}>일상</MenuItem>
            <MenuItem value={2}>여행</MenuItem>
            <MenuItem value={3}>음식</MenuItem>
          </Select>
        </FormControl>

        <TextField inputRef={titleRef}
          label="제목"
          variant="outlined"
          margin="normal"
          fullWidth
        />

        <TextField inputRef ={contentRef}
          label="내용"
          variant="outlined"
          margin="normal"
          fullWidth
          multiline
          rows={4}
        />

        <Box display="flex" alignItems="center" margin="normal">
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
          {/* {file && (
            <Avatar
              alt="첨부된 이미지"
              src={URL.createObjectURL(file)}
              sx={{ width: 56, height: 56, marginLeft: 2 }}
            />
          )} */}
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            {file ? file.name : '첨부할 파일 선택'}
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          style={{ marginTop: '20px' }} 
          onClick={() => {addFeed()}}>
          등록하기
        </Button>
      </Box>
    </Container>
  );
}

export default Register;