const express = require('express');
const router = express.Router();
const db = require('../db');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


router.get('/', async(req, res) => {
    try {
        let query = "select f.*, user_nickname from feed f inner join users u on f.user_id = u.user_id";
        let [list] = await db.query(query);

        res.json({
            list : list
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.get('/img', async(req, res) => {
    try {
        let query = "select i.* from img i inner join feed f on i.target_id = f.feed_id where i.type = 'feed'";
        let [list] = await db.query(query);
        res.json({
            imgList : list
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.get('/:feed_id', async (req, res) => {

    const {feed_id} = req.params;

    try {
        let query = "select f.*, user_nickname from feed f inner join users u on f.user_id = u.user_id where feed_id = ?";
        let [list] = await db.query(query, [feed_id]);

        res.json({
            feed : list[0]
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})



router.post('/', async(req, res) => {
    const {userId, title, content} = req.body;
    try {
        let query = "insert into feed values(null, ?, ?, ?, NOW(), null, null)";
        let result = await db.query(query, [userId, title, content]);
        console.log(result);
        res.json({
            message : "등록되었습니다.",
            result : result[0]
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.post('/img', async (req, res) => {
    const { feedId } = req.body;
    try {
        let query = "select i.* from img i inner join feed f on i.target_id = f.feed_id where i.target_id = ? and i.type = 'feed'";
        let [list] = await db.query(query, [feedId]);

        res.json({
            list : list
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
    
})

router.delete('/:feed_id', async(req, res) => {
    const {feed_id} = req.params;
    try {
        let query = "delete from feed where feed_id = ?";
        let result = await db.query(query, [feed_id]);
        console.log(result);
        res.json({
            message : "삭제되었습니다."
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.post("/upload", upload.array('file'), async (req, res) => {
    let {feedId} = req.body;
    const files = req.files;
/*
    req.files
    const filename = req.file.filename;
    const filePath = req.file.destination;
*/

    try{
        let results = [];

        for(let file of files) {
            let filename = file.filename;
            let filePath = file.destination;
            
            let query = "INSERT INTO IMG VALUES(null, ?, 'feed', ?, ?)";
            let result = await db.query(query, [feedId, filename, filePath]);
            results.push(result);
        }
        res.json({
            message : "등록 완료",
            result : results
        })
    } catch(err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.put("/:feedId", async (req, res) => {
    let {feedId} = req.params;
    let {feed_title, feed_content} = req.body;

    try {
        let query = "update feed set feed_title = ?, feed_content = ? where feed_id = ?";
        let result = await db.query(query, [feed_title, feed_content, feedId]);

        res.json({
            message : "수정 완료",
            result : result
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})



module.exports = router