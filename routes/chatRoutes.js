const express = require('express');
const router = express.Router();
const { chatWithGPT } = require('../controllers/chatController');

router.post('/', chatWithGPT);

module.exports = router;
