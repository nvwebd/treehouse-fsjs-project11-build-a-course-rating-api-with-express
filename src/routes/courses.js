const express = require('express');
const router = express.Router();
const Course = require('./../db/models/Course');
const Review = require('./../db/models/Review');
const authenticateUserMiddleware = require('./../middlewares/authenticateUserMiddleware');
const noSelfReviewMiddleWare = require('./../middlewares/noSelfReviewMiddleWare');
const errorFormatter = require('./../utils/errorFormatter');

router
  .route('/')
  .get((req, res) => {
    Course.find({}, '_id title')
      .then(course => res.json(course))
      .catch(error => next(errorFormatter(error)));
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
      .catch(error => next(errorFormatter(error)));
  });

router
  .route('/:id')
  .get((req, res, next) => {
    Course.findById(req.params.id)
      .exec()
      .then(course => {
        const populationOptions = [
          {
            path: 'reviews',
            populate: {
              path: 'user',
              select: '_id fullName',
            },
          },
          {
            path: 'user',
            select: '_id fullName',
          },
        ];

        Course.populate(course, populationOptions)
          .then(populatedCourse => res.json(populatedCourse))
          .catch(error => next(errorFormatter(error)));
      })
      .catch(error => next(errorFormatter(error)));
  })
  .put(authenticateUserMiddleware, (req, res, next) => {
    // const updateCourseData = req.bod
    Course.findOneAndUpdate({ _id: req.params.id }, { ...req.body })
      .then(() => res.status(204).send())
      .catch(error => next(errorFormatter(error)));
  });

router
  .route('/:id/reviews')
  .post(
    authenticateUserMiddleware,
    noSelfReviewMiddleWare,
    (req, res, next) => {
      const course = req.course;

      Review.create(req.body)
        .then(review => {
          course
            .update({ $push: { reviews: review._id } })
            .then(() => {
              console.log('updated the course with the review!');
              res.location('/');
              res.status(201).send();
            })
            .catch(error => next(errorFormatter(error)));
        })
        .catch(error => next(errorFormatter(error)));
    }
  );

module.exports = router;
