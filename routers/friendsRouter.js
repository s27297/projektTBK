const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../schemas/userSchema');
const friendsController = require('../controllers/friendsController');
const { authenticate } = require('../auth/authMiddleware');

router.use(authenticate);

//get all friends of a user (id in path)
router.get('/', friendsController.getUserFriends)
//add user2 from friends of user1 (id usera1 in path,id usera2 in body)
router.post('/', friendsController.addUserFriend)
//delete user2 from friends of user1 (id usera1 in path,id usera2 in body)
router.delete('/',friendsController.deleteUserFriend)

router.delete('/:id',friendsController.odrzutUserFriend)
router.patch('/:id',friendsController.acceptUserFriend)

module.exports = router;