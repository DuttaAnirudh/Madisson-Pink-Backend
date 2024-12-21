const RoomType = require('../models/RoomType');
const Room = require('../models/Room');

/////////////////////////////////////////////////
/**
 * ROOM-TYPE CONTROLLER
 */

// GET: All Room Types
exports.getAllRoomTypes = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    body: req.body,
  });
};

// CREATE: Room Type
exports.createRoomType = async (req, res, next) => {
  try {
    console.log(req.body);
    const newRoomType = await RoomType.create(req.body);

    res.status(200).json({
      status: 'success',
      data: { data: newRoomType },
    });
  } catch (err) {
    console.log(err);
  }
};

// UPDATE: Room Type
exports.updateRoomType = async (req, res, next) => {
  try {
    console.log(req.params.id);

    const roomType = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return new document
      runValidators: true,
    });

    if (!roomType) {
      throw new Error('Unable to update Room type');
    }

    res.status(200).json({
      status: 'success',
      data: { data: roomType },
    });
  } catch (err) {
    console.log(err);
  }
};

/////////////////////////////////////////////////
/**
 * ROOM CONTROLLER
 */

exports.getAllRooms = async (req, res, next) => {
  try {
    // Getting all the roooms in the roooms db
    // remove 'id' and 'v' from the response
    const rooms = await Room.find().select('-_id -__v');

    // send all the room in response
    res.status(200).json({
      status: 'success',
      data: { rooms },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    // getting the room name slug from the url
    const roomSlug = req.params.roomName;

    // Fetching room data based off room name slug
    // remove 'id' and 'v' from the response
    const room = await Room.findOne({ slug: roomSlug }).select('-_id -__v');

    res.status(200).json({
      status: 'success',
      data: { room },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    // getting the room type slug from the url
    const roomTypeSlug = req.params.roomType;

    // getting the room type id from the db
    const roomTypeId = await RoomType.findOne(
      { slug: roomTypeSlug },
      'Object_id',
    );

    if (!roomTypeId._id) {
      throw new Error('Unable to create a room');
    }

    // adding room type id to the request body
    req.body.roomType = roomTypeId._id;

    // Creating a new room
    const room = await Room.create(req.body);

    // Sending the response with new room data
    res.status(200).json({
      status: 'success',
      data: { room },
    });
  } catch (err) {
    console.log(err);
  }
};
