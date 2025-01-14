const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const messageController = require('../controllers/messageController');
const {authenticate} = require("../auth/authMiddleware");

router.use(authenticate);

//get komentarze wyslane przez jednego usera innemu useru (from i to w body)
router.get('/', messageController.getMessages)

//add komentarz od usera do usera(from i to w body)
router.post('/', messageController.addMessage)


//edit komentarza (id komentarza w path,text in body)
router.patch('/:id', messageController.editMessage)


//delete komentarza (id komentarza w path)
router.delete('/:id', messageController.deleteMessage)


module.exports = router;