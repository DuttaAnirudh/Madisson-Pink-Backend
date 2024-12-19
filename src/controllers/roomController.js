const RoomType = require('../models/RoomType');

exports.getAllRoomTypes = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    body: req.body,
  });
};

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
