const express = require('express');
const router = express.Router();
const User = require('./../db/models/User');
const authenticateUserMiddleware = require('./../middlewares/authenticateUserMiddleware');
const errorFormatter = require('./../utils/errorFormatter');

router
  .route('/')
  .get(authenticateUserMiddleware, (req, res) => {
    /**
     * return the currently authenticated user
     */
    res.json(req.currentAuthUser);
  })
  .post((req, res, next) => {
    const newUser = new User(req.body);

    /**
     * add new user
     */
    newUser
      .save()
      .then(() => {
        res
          .status(201)
          .set('Location', '/')
          .end();
      })
      .catch(error => next(errorFormatter(error)));
  });

module.exports = router;
