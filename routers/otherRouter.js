const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
const {authenticate} = require("../auth/authMiddleware.js");
const AdminController = require('../controllers/adminController.js');
const OtherController = require('../controllers/otherController.js');

router.use(authenticate);

router.get("/reports",AdminController.getReport)
router.get("/history/changes",OtherController.historyChanges)

module.exports = router;