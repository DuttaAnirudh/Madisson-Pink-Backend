const RoomType = require('../models/RoomType');

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
