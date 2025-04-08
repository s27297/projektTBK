const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// const User = require('../schemas/userSchema.js');
const userController = require('../controllers/userController.js');
const { authenticate,authorize } = require('../auth/authMiddleware.js');
const adminController = require('../controllers/adminController.js');
const PostsController = require('../controllers/postsController.js');
const GroupsController = require('../controllers/groupsController.js');

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