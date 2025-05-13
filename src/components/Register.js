import React, { useState, useRef } from 'react';
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
  Stack,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const sessionUser = jwtDecode(token);

  const [files, setFiles] = useState([]);         // File 객체 배열
  const [previews, setPreviews] = useState([]);   // preview URL 배열

  const titleRef = useRef();
  const contentRef = useRef();

  // 파일 선택 시
  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files);
    setFiles(chosen);
    // URL 생성
    setPreviews(chosen.map(file => URL.createObjectURL(file)));
  };

  // 개별 미리보기 제거
  const handleRemove = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const addFeed = () => {
    fetch("http://localhost:3000/feed", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        userId: sessionUser.userId,
        title: titleRef.current.value,
        content: contentRef.current.value
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (files.length > 0) {
        fnUploadFile(data.result.insertId);
      } else {
        navigate("/feed");
      }
    });
  };

  const fnUploadFile = (feedId) => {
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));
    formData.append("feedId", feedId);

    fetch("http://localhost:3000/feed/upload", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(_ => {
      navigate("/feed");
    })
    .catch(err => console.error(err));
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ p:2 }}>
        <Typography variant="h4" gutterBottom>등록</Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>카테고리</InputLabel>
          <Select defaultValue="" label="카테고리">
            <MenuItem value={1}>일상</MenuItem>
            <MenuItem value={2}>여행</MenuItem>
            <MenuItem value={3}>음식</MenuItem>
          </Select>
        </FormControl>

        <TextField inputRef={titleRef} label="제목" fullWidth margin="normal"/>
        <TextField inputRef={contentRef} label="내용" fullWidth multiline rows={4} margin="normal"/>

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

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 4 }}
          onClick={addFeed}
        >
          등록하기
        </Button>
      </Box>
    </Container>
  );
}

export default Register;
