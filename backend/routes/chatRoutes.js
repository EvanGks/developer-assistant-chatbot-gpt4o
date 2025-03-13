// backend/routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Update to use the streamChat function that exists in your controller
router.post('/', chatController.streamChat);

module.exports = router;