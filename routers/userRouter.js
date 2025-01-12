const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../schemas/userSchema');
const userController = require('../controllers/userController');
const { authenticate } = require('../auth/authMiddleware');


router.get('/', (req, res) => {
    res.send('welcome');
})

//add user (email,password,login in body)
router.post("/register", userController.newUser);

router.use(authenticate);
//wszystkie usery
router.get('/all', userController.allUsers);
//edit profile of a user  (name,email,password,login,opis,image OR wiek in body,id usera in path)
router.put('/:id/profile',userController.updateProfile);
//get user info (id usera in path)
router.get('/:id/profile',userController.getUserProfile);
//get all friends of a user (id in path)
router.get('/:id/friends', userController.getUserFriends)
//add user2 from friends of user1 (id usera1 in path,id usera2 in body)
router.post('/:id/friends', userController.addUserFriend)
//delete user2 from friends of user1 (id usera1 in path,id usera2 in body)
router.delete('/:id/friends',userController.deleteUserFriend)




//jeszcze nie ma
router.patch('/:id/settings',userController.settings)
//jeszcze nie ma
router.patch('/:id/preferences',userController.settings)
//jeszcze nie ma
router.patch('/:id/activity',userController.settings)

module.exports = router;


//db.User.insertOne(user)
// {
//     'name':'first',
//     'email':'w@2.com',
//     'password':'qwerty',
//     'login':'pierwszy'
// }