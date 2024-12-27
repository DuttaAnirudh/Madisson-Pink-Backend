const Amenity = require('../models/Amenity');

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorHandler');

exports.getAllAmenties = catchAsync(async (req, res, next) => {
  // Getting all the amenities in the amenities db if no queries are present in the url
  // else mutate and return data based on the queries in the url
  // The chaining below works because we have returned 'this' after calling each of the following methods
  const features = new APIFeatures(Amenity.find(), req.query)
    .filter()
    .sort()
    .fieldLimiting()
    .pagination();

  const amenities = await features.query;

  res.status(200).json({
    status: 'success',
    results: amenities.length,
    data: { amenities },
  });
});

exports.getAmenity = catchAsync(async (req, res, next) => {
  // Fetching amenity data based off amenity name slug
  // remove 'id' and 'v' from the response
  const amenity = await Amenity.findOne({
    slug: req.params.amenityName,
  }).select('-_id -__v');

  if (!amenity) {
    return next(new AppError('No amenity was found with that name', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { amenity },
  });
});

exports.createAmenties = catchAsync(async (req, res, next) => {
  // Creating a new amenity
  const newAmenity = await Amenity.create(req.body);

  // Sending a OK response with new amenity data
  res.status(201).json({
    status: 'success',
    data: { data: newAmenity },
  });
});

exports.updateAmenity = catchAsync(async (req, res, next) => {
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
});
