const express = require('express');
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ROOM TYPE ROUTES
router
  .route('/room-types')
  .get(roomController.getAllRoomTypes)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    roomController.createRoomType,
  );

router
  .route('/room-types/:roomType')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    roomController.updateRoomType,
  );

// ROOM ROUTES
router.route('/available').get(roomController.getRoomsAvailable);

router
  .route('/')
  .get(roomController.getAllRooms)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    roomController.createRoom,
  );

router
  .route('/:roomName')
  .get(roomController.getRoom)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    roomController.updateRoom,
  );

module.exports = router;
