const express = require('express');
const router = express.Router();
const Course = require('./../db/models/Course');
const authenticateUserMiddleware = require('./../middlewares/authenticateUserMiddleware');

router
  .route('/')
  .get((req, res) => {
    Course.find({}, '_id title', (error, courses) => {
      if (error) {
        return next(error);
      } else {
        res.json(courses);
      }
    });
  })
  .post(authenticateUserMiddleware, (req, res, next) => {
    const newCourse = new Course(req.body);

    newCourse
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

router
  .route('/:id')
  .get((req, res, next) => {
    Course.findById(req.params.id)
      .populate('user')
      .populate('reviews')
      .exec()
      .then(course => {
        res.json(course);
      })
      .catch(error => {
        console.error(error);
        return next(error);
      });
  })
  .put(authenticateUserMiddleware, (req, res, next) => {
    // const updateCourseData = req.bod
    Course.findOneAndUpdate({ _id: req.params.id }, { ...req.body })
      .then(() => {
        res.status(204).send();
      })
      .catch(error => {
        return next(error);
      });
  });

router
  .route('/:id/reviews')
  .post(authenticateUserMiddleware, (req, res, next) => {});

module.exports = router;
