const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../schemas/userSchema');
const userController = require('../controllers/userController');
const { authenticate,authorize } = require('../auth/authMiddleware');
const adminController = require('../controllers/adminController');
const PostsController = require('../controllers/postsController');
const GroupsController = require('../controllers/groupsController');

router.use(authenticate);
router.use(authorize);

//get repports  (email,password,login in body)
router.get("/reports", adminController.getReport);
//Zarządzanie użytkownikami przez administratorów
router.get("/users", userController.allUsers);
router.delete("/users/:id", adminController.deleteUser);
router.post("/users/:id", adminController.refereshUser);
router.put("/users/:id", userController.updateProfile);

//Zarządzanie treściami na platformie przez administratorów
router.get("/content",PostsController.getPosts)
router.delete("/content/post/:id",PostsController.deletePost)
router.delete("/content/comment/:id",PostsController.deleteComment)

//Zarządzanie groupami na platformie przez administratorów
router.get("/groups",GroupsController.getGroups)
router.delete("/groups/:id",GroupsController.deleteGroup)
router.put("/groups/:id",GroupsController.editGroup)

module.exports = router;