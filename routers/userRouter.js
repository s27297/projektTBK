const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../auth/authMiddleware');
const OtherController = require("../controllers/otherController");


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

router.patch('/:id/settings',userController.settings)

router.patch('/:id/preferences',userController.settings)

router.get("/:id/activity}",OtherController.getActivity)

module.exports = router;


//db.User.insertOne(user)
// {
//     'name':'first',
//     'email':'w@2.com',
//     'password':'qwerty',
//     'login':'pierwszy'
// }