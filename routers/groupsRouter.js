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
//add member to group(id group w path,member in path)
router.delete('/:id/members', groupsController.deleteMemberFromGroup)
//delete member from group(id group w path,member in path)
router.patch('/:id/members', groupsController.addMemberToGroup)


module.exports = router;