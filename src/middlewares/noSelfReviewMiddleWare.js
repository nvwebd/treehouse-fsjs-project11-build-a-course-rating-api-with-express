const Course = require('./../db/models/Course');
const errorFormatter = require('./../utils/errorFormatter');

/**
 * Middleware which prevents Reviewing a course by the Authenticated user
 * @param req - Request
 * @param res - Response
 * @param next - Function
 */
module.exports = (req, res, next) => {
  const userID = req.currentAuthUser._id.toString();
  const courseID = req.params.id;

  /**
   * get the course to check if the review can be done
   */
  Course.findOne({ _id: courseID })
    .then(course => {
      if (userID === course.user._id.toString()) {
        const error = new Error('Dooh, reviewing your own project are we?');
        error.status = 400;
        return next(error);
      } else {
        req.course = course;
        return next();
      }
    })
    .catch(error => {
      errorFormatter(error);
      return next(error);
    });
};
