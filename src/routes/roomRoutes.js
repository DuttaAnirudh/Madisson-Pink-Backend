const express = require('express');
const roomController = require('../controllers/roomController');

const router = express.Router();

// ROOM TYPE ROUTES
router
  .route('/room-types')
  .get(roomController.getAllRoomTypes)
  .post(roomController.createRoomType);

router.route('/room-types/:roomType').patch(roomController.updateRoomType);

// ROOM ROUTES
router
  .route('/')
  .get(roomController.getAllRooms)
  .post(roomController.createRoom);

router
  .route('/:roomName')
  .get(roomController.getRoom)
  .patch(roomController.updateRoom);

module.exports = router;
