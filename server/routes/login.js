const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_KEY = "jwtkey";

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let query = "select user_id, user_email, password, user_nickname, intro from users where user_email = ?";
        let [user] = await db.query(query, [email]);
        let result = {};
        if(user.length > 0) {
            let isMatch = await bcrypt.compare(password, user[0].password);
            if(isMatch) {
                // jwt 토큰 생성
                let payload = {
                    userId : user[0].user_id,
                    userEmail : user[0].user_email,
                    userNickname : user[0].user_nickname,
                    userIntro : user[0].intro,
                };

                const token = jwt.sign(payload, JWT_KEY, {expiresIn : '1h'});
                console.log(token);

                result = {
                    message : "로그인 성공!",
                    success : true,
                    token : token
                }
            } else {
                result = {
                    success : false,
                    message : "비밀번호를 확인하세요."
                }
            }
            
        } else {
            result = {
                success : false,
                message : "아이디를 확인하세요."
            }
        }
        res.json(result);
    } catch(err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router