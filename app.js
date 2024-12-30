const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const roomRouter = require('./src/routes/roomRoutes');
const amenityRouter = require('./src/routes/amenityRoutes');
const userRouter = require('./src/routes/userRoutes');

const AppError = require('./src/utils/errorHandler');
const errorHandlingMiddleware = require('./src/middleware/errorHandlingMiddleware');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // limiting data that can be accepted by the server
app.use(bodyParser.json());

app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/amenities', amenityRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandlingMiddleware);

module.exports = app;
