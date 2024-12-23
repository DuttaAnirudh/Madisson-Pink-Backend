const express = require('express');
const amenityController = require('../controllers/amenityController');

const router = express.Router();

router
  .route('/')
  .get(amenityController.getAllAmenties)
  .post(amenityController.createAmenties);

router
  .route('/:amenityName')
  .get(amenityController.getAmenity)
  .patch(amenityController.updateAmenity);

module.exports = router;
