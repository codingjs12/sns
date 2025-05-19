const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/join', async (req, res) => {
    const { email, nickname, password } = req.body;
    try {
        let hashPwd = await bcrypt.hash(password, 10);
        let query = "INSERT INTO users VALUES(null, ?, ?, ?, null)";
        let [user] = await db.query(query, [email, hashPwd, nickname]);
        res.json({
            message : "회원가입 성공!"
        })
    } catch(err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/user/:userId', async(req, res) => {
    const {userId} = req.params;
    try {
        let query = "SELECT user_id, user_email, user_nickname, intro FROM USERS WHERE user_id = ?";
        let [user] = await db.query(query, [userId]);

        res.json({
            info : user[0]
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }

})

router.get('/user/img/:userId', async(req, res) => {
    const {userId} = req.params;
    try {
        let query = "select img_name, img_path from img i "
            + "inner join users u on i.target_id = u.user_id where user_id = ? and type = 'user'";
        let [user] = await db.query(query, [userId]);
        if(user.length == 0) {
            imgInfo = {
                img_name : "",
                img_path : ""
            }
            res.json({
                imgInfo : imgInfo
            })
        } 
        else {
            res.json({
                imgInfo : user[0]
            })
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }

})

router.get('/user/isFollowing/from/:follower/to/:following', async(req, res) => {
    const {follower, following} = req.params;
    try {
        let query = "SELECT * FROM follow WHERE follower_id = ? and following_id = ?";
        let [isFollowing] = await db.query(query, [follower, following]);
        if(isFollowing.length == 0) {
            res.json({
                isFollowing : false
            })
        } else {
            res.json({
                isFollowing : true
            })
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.post('/user/follow', async(req, res) => {
    const {followerId, followingId} = req.body;
    try {
        let query = "INSERT INTO follow VALUES(?, ?, NOW())";
        let result = await db.query(query, [followerId, followingId]);
        res.json({
            message : "팔로우 성공!"
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.post('/user/unfollow', async(req, res) => {
    const {followerId, followingId} = req.body;
    try {
        let query = "DELETE FROM follow WHERE follower_id = ? and following_id = ?";
        let result = await db.query(query, [followerId, followingId]);
        res.json({
            message : "언팔로우 성공!"
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})



module.exports = router