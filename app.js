const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const roomRouter = require('./src/routes/roomRoutes');
const amenityRouter = require('./src/routes/amenityRoutes');

const app = express();

app.use(morgan('dev'));

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // limiting data that can be accepted by the server
app.use(bodyParser.json());

app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/amenities', amenityRouter);

module.exports = app;
