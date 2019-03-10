const auth = require('basic-auth');
const User = require('./../db/models/User');

/**
 * Module Authenticates the user against the DB
 * @param req - Request
 * @param res - Response
 * @param next - next()
 * @returns {*}
 */
module.exports = (req, res, next) => {
  /**
   * Reads the name & password from the Authentication Header
   * @type {never|auth.BasicAuthResult}
   */
  const credentials = auth(req);

  if (!credentials) {
    const error = new Error('Credentials missing.');
    error.status = 400;
    return next(error);
  } else {
    /**
     * Sends the name & password to check if they are the same
     */
    User.auth(credentials.name, credentials.pass, (error, user) => {
      if (error || !user) {
        console.error(error);
        return next(error);
      } else if (!user) {
        const error = new Error('User Not Found');
        error.status = 403;
        return next(error);
      } else {
        req.currentAuthUser = user;
        return next();
      }
    });
  }
};
