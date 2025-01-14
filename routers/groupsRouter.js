const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const groupsController = require('../controllers/groupsController');
const {authenticate} = require("../auth/authMiddleware");

router.use(authenticate);

//get groups of a user(id of a user w body)
router.get('/', groupsController.getGroups)

//add group z 1 userem(id usera w body)
router.post('/', groupsController.addGroup)

//edit group (id group w path,new users,deleted users,name in body)
router.put('/:id', groupsController.editGroup)


//delete group (id group w path)
router.delete('/:id', groupsController.deleteGroup)


module.exports = router;