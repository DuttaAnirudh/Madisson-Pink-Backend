const Amenity = require('../models/Amenity');

exports.getAllAmenties = async (req, res, next) => {
  try {
    // GET all the amenities available
    // remove 'id' and 'v' from the response
    const amenities = await Amenity.find().select('-_id -__v');

    res.status(200).json({
      status: 'success',
      data: { amenities },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAmenity = async (req, res, next) => {
  try {
    // Fetching amenity data based off amenity name slug
    // remove 'id' and 'v' from the response
    const amenity = await Amenity.findOne({
      slug: req.params.amenityName,
    }).select('-_id -__v');

    res.status(200).json({
      status: 'success',
      data: { amenity },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createAmenties = async (req, res, next) => {
  try {
    // Creating a new amenity
    const newAmenity = await Amenity.create(req.body);

    // Sending a OK response with new amenity data
    res.status(201).json({
      status: 'success',
      data: { data: newAmenity },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateAmenity = async (req, res, next) => {
  try {
    // Finding the amenityName which is same as the one in params in the url
    // Then upating the amenity and returning the new(updated) amenity
    const updatedAmenity = await Amenity.findOneAndUpdate(
      { slug: req.params.amenityName },
      req.body,
      {
        runValidators: true,
        new: true, // return new document
      },
    );

    res.status(200).json({
      status: 'success',
      data: { data: updatedAmenity },
    });
  } catch (err) {
    console.log(err);
  }
};
