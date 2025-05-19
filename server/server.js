const express = require('express');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const feedRouter = require('./routes/feed');
const commentRouter = require('./routes/comment');
const mypageRouter = require('./routes/mypage');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost',
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', userRouter);
app.use('/', loginRouter);
app.use('/user', mypageRouter);
app.use('/feed', feedRouter);
app.use('/feed', commentRouter);




app.listen(3000, ()=>{
    console.log("서버 실행 중!");
});