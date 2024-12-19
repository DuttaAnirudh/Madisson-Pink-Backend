const express = require('express');
const roomController = require('../controllers/roomController');

const router = express.Router();

router
  .route('/room-types')
  .get(roomController.getAllRoomTypes)
  .post(roomController.createRoomType);

module.exports = router;
