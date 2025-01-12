const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../schemas/userSchema');
const postsController = require('../controllers/postsController');
const {authenticate} = require("../auth/authMiddleware");

router.get('/', (req, res) => {
    res.send('welcome');
})
router.use(authenticate);

//add post to user (user,text,header,{share||All} in body)
router.post("/", postsController.newPost);

//edit post  (text OR header in body, id posta in path)
router.put("/:id", postsController.editPost);

//delete post (id posta in path)
router.delete("/:id", postsController.deletePost);

//add or delete like from post (id posta in path,user in body)
router.put("/:id/likes", postsController.addLike);

//edit share of a post (id posta in path,share in body)
router.put("/:id/share", postsController.sharePost);

//add comment to post (id posta in path, user,text,(tagged jezeli jest) in body)
router.post("/:id/comments", postsController.addComment);

//delete comment  (id commenta in path)
router.delete("/:id/comments", postsController.deleteComment);

//edit comment (id commenta in path,text in body)
router.put("/:id/comments", postsController.editComment);





module.exports = router;