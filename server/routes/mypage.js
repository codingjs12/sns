const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. 패키지 추가
const multer = require('multer');

// 2. 저장 경로 및 파일명
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/follower/:userId', async (req, res) => {
    const {userId} = req.params;

    try {
        let query = "select count(*) as count from users u inner join follow f on f.follower_id = u.user_id where u.user_id = ?";
        let [follower] = await db.query(query, [userId]);

        res.json({follower : follower[0].count});
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }

})

router.get('/following/:userId', async (req, res) => {
    const {userId} = req.params;

    try {
        let query = "select count(*) as count from users u inner join follow f on f.following_id = u.user_id where u.user_id = ?";
        let [following] = await db.query(query, [userId]);

        res.json({
            following : following[0].count
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }

})

router.get('/feedCnt/:userId', async (req, res) => {
    const {userId} = req.params;

    try {
        let query = "select count(*) as count from users u inner join feed f on f.user_id = u.user_id where u.user_id = ?";
        let [count] = await db.query(query, [userId]);

        res.json({
            count : count[0].count
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }

})

// 프로필 사진 업로드
router.post("/upload", upload.single('file'), async (req, res) => {
    const {userId} = req.body;
    const filename = req.file ? req.file.filename : null;
    const destination = req.file ? req.file.destination : null;

    try {
        const [rows] = await db.query(
            "SELECT * FROM img WHERE target_id = ? AND type = 'user'",
            [userId]
        );

        if(rows.length > 0) {
            let query = "update img set img_name = ?, img_path = ? where target_id = ? and type = 'user'";
            let result = await db.query(query, [filename, destination, userId]);

            res.json({
                result : result,
                message : "수정되었습니다."
            })
        } else {
            let query = "insert into img values(null, ?, 'user', ?, ?)";
            let result = await db.query(query, [userId, filename, destination]);

            res.json({
                result : result,
                message : "등록되었습니다."
            })
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})












module.exports = router