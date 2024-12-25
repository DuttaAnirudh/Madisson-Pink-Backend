const RoomType = require('../models/RoomType');
const Room = require('../models/Room');
const Amenity = require('../models/Amenity');
const { Query } = require('mongoose');

/////////////////////////////////////////////////
/**
 * ROOM-TYPE CONTROLLER
 */

// GET: All Room Types
exports.getAllRoomTypes = async (req, res, next) => {
  try {
    // Getting all the rooom types in the rooomTypes db
    // remove 'id' and 'v' from the response
    const roomTypes = await RoomType.find().select('-_id -__v');

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
    const queryObj = { ...req.query };
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);

    // FILTERING
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Room.find(JSON.parse(queryStr));

    // SORTING
    if (req.query.sort) {
      const sortyBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortyBy);
    } else {
      query = query.sort('-createdAt');
    }

    // FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-_id -__v');
    }

    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit); //page=2&limit=10 --> page1: 1-10, page2:11-20

    if (req.query.page) {
      const numRooms = await Room.countDocuments(); // returns the total number of documents in a collection

      if (skip >= numRooms) throw new Error('This page does not exist');
    }

    // Getting all the roooms in the roooms db
    // remove 'id' and 'v' from the response
    const rooms = await query;

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
