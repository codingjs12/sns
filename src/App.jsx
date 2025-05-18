import { Route, Routes, useLocation } from 'react-router-dom';
import Join from './components/Join'
import Login from './components/Login';
import Feed from './components/Feed';
import Register from './components/Register';
import { Box, CssBaseline } from '@mui/material';
import Menu from './components/Menu';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MyPage from './components/MyPage';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/join';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!isAuthPage && <Menu />} {/* 로그인과 회원가입 페이지가 아닐 때만 Menu 렌더링 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/feed/add" element={<Register />} />
          <Route path="/mypage/:userId" element={<MyPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
