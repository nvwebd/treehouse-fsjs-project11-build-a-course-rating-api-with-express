const express = require('express');
const router = express.Router();
const User = require('./../db/models/User');
const authenticateUserMiddleware = require('./../middlewares/authenticateUserMiddleware');

router
  .route('/')
  .get(authenticateUserMiddleware, (req, res) => {
    console.log('req.currentAuthUser: ', req.currentAuthUser);
    res.json(req.currentAuthUser);
  })
  .post((req, res, next) => {
    const newUser = new User(req.body);

    newUser
      .save()
      .then(() => {
        res
          .status(201)
          .set('Location', '/')
          .end();
      })
      .catch(err => {
        err.status = 400;
        next(err);
      });
  });

module.exports = router;
