const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:feed_id/comments', async (req, res) => {
    const {feed_id} = req.params;
    try {
        let query = "select c.*, user_nickname from comments c inner join users u on c.user_id = u.user_id where feed_id = ?";
        let [rows] = await db.query(query, [feed_id]);

        // 트리 구조로 변환
        const commentMap = {};
        const rootComments = [];

        rows.forEach((comment) => {
        comment.replies = [];
        commentMap[comment.comments_id] = comment;
        });

        rows.forEach((comment) => {
        if (comment.parent_comment_id) {
            commentMap[comment.parent_comment_id]?.replies.push(comment);
        } else {
            rootComments.push(comment);
        }
        });

        res.json({ comments : rootComments })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
    
})

router.post('/:feed_id/comments', async (req, res) => {
    const {feed_id} = req.params;
    const {userId, parent_id, comments_content} = req.body;
    
    try {
        let query = "insert into comments values(null, ?, ?, ?, ?, NOW(), 'N')";
        let result = await db.query(query, [parent_id, feed_id, userId, comments_content]);

        res.json({ result })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.delete('/:comments_id/comments', async (req, res) => {
   const {comments_id} = req.params;

  // 이 댓글이 부모인지 (즉, 자식이 있는지) 확인
  const [childRows] = await db.query(
    "SELECT COUNT(*) AS count FROM comments WHERE parent_comments_id = ?",
    [comments_id]
  );

  if (childRows[0].count > 0) {
    // 자식 댓글이 있으면 is_deleted로 플래그만 설정
    await db.query(
      "UPDATE comments SET is_deleted = 'Y' WHERE comments_id = ?",
      [comments_id]
    );
    res.json({ message: "대댓글이 있어 삭제된 것으로만 표시됩니다." });
  } else {
    // 자식 댓글 없으면 완전 삭제
    await db.query(
      "DELETE FROM comments WHERE comments_id = ?",
      [comments_id]
    );
    res.json({ message: "댓글이 완전히 삭제되었습니다." });
  }
})

module.exports = router