'use strict';

// load modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const auth = require('basic-auth');
const User = require('./db/models/User');

/**
 * Mongo connection string and a port - change these if your mongo runs somewhere else than the standard localhost
 * @type {string}
 */
const mongoUrl = 'mongodb://localhost/course-api';
const mongoPort = 27107;

/**
 * Require all of the Models to trigger the Models to build - needed for population
 */
require('./db/models/Review');
require('./db/models/Course');
require('./db/models/User');

/**
 * Setting up the mongo connection with mongoose - return the connection status
 */
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(
    () => {
      console.log(
        `Mongo Connection Established -> Connected to ${mongoUrl} ...`
      );
    },
    err => console.error('Connection to Mongo failed: ', err.message)
  );

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

//  parses incoming requests with JSON payloads - former body-parser package
app.use(express.json());

/**
 * use session
 */
app.use(
  session({
    secret: 'something secret',
    resave: true,
    saveUninitialized: false,
  })
);

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API',
  });
});

// inject routes
const courses = require('./routes/courses');
const users = require('./routes/users');

// set the app to use these routes
app.use('/api/courses', courses);
app.use('/api/users', users);

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
