const express = require('express');
const router = express.Router();
const { authenticate,authorize } = require('../auth/authMiddleware.js');
const bannedController = require('../controllers/bannedController.js');

router.use(authenticate);

router.post('/',bannedController.addBanned);
router.use(authorize);
router.get('/',bannedController.getBanned);
router.delete('/:id',bannedController.deleteBanned)
module.exports = router;