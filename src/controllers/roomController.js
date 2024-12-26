const RoomType = require('../models/RoomType');
const Room = require('../models/Room');
const Amenity = require('../models/Amenity');
const APIFeatures = require('../utils/apiFeatures');

/////////////////////////////////////////////////
/**
 * ROOM-TYPE CONTROLLER
 */

// GET: All Room Types
exports.getAllRoomTypes = async (req, res, next) => {
  try {
    // Getting all the rooom types in the rooomTypes db if no queries are present in the url
    // else mutate and return data based on the queries in the url
    // The chaining below works because we have returned 'this' after calling each of the following methods
    const features = new APIFeatures(RoomType.find(), req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .pagination();

    const roomTypes = await features.query;

    res.status(200).json({
      status: 'success',
      data: { data: roomTypes },
    });
  } catch (err) {
    console.log(err);
  }
};

// CREATE: Room Type
exports.createRoomType = async (req, res, next) => {
  try {
    console.log(req.body);
    const newRoomType = await RoomType.create(req.body);

    res.status(201).json({
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
    // Update room type based by taking roomType slug from the params in the url
    const roomType = await RoomType.findOneAndUpdate(
      { slug: req.params.roomType },
      req.body,
      {
        new: true, // return new document
        runValidators: true,
      },
    ).select('-_id -__v');

    if (!roomType) {
      throw new Error('Unable to update Room type');
    }

    // send the OK response with the updated data
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
    // Getting all the roooms in the roooms db if no queries are present in the url
    // else mutate and return data based on the queries in the url
    // The chaining below works because we have returned 'this' after calling each of the following methods
    const features = new APIFeatures(Room.find(), req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .pagination();

    const rooms = await features.query;

    // send all the room in response
    res.status(200).json({
      status: 'success',
      results: rooms.length,
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
    const { roomTypeSlug, amenitiesSlug } = req.body;

    // getting the room type id from the db
    const roomTypeId = await RoomType.findOne(
      { slug: roomTypeSlug },
      'Object_id',
    );

    if (!roomTypeId._id) {
      throw new Error('Unable to create a room');
    }

    // getting the ids of all the amenities from the db
    const amenities = await Amenity.find({
      slug: { $in: amenitiesSlug },
    }).select('_id');

    // adding room type id to the request body
    req.body.roomType = roomTypeId._id;

    // adding amenities id into request body
    req.body.specificAmenities = amenities || [];

    // Creating a new room
    const room = await Room.create(req.body);

    // Sending the response with new room data
    res.status(201).json({
      status: 'success',
      data: { room },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    // Finding the roomNumber which is same as the one in params in the url
    const room = await Room.findOneAndUpdate(
      { slug: req.params.roomName },
      req.body,
      {
        new: true, // return new document
        runValidators: true,
      },
    );

    if (!room) {
      throw new Error('Unable to update Room type');
    }

    // Send the response after the room is updated
    res.status(200).json({
      status: 'success',
      data: { room },
    });
  } catch (err) {
    console.log(err);
  }
};
