const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const messageController = require('../controllers/messageController');
const {authenticate} = require("../auth/authMiddleware");
const AdminController = require('../controllers/adminController');
const OtherController = require('../controllers/otherController');

router.use(authenticate);

router.get("/reports",AdminController.getReport)
router.get("/history/changes",OtherController.historyChanges)

module.exports = router;