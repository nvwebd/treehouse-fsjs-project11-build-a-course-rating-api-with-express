const auth = require('basic-auth');
const User = require('./../db/models/User');

module.exports = (req, res, next) => {
  const credentials = auth(req);

  if (!credentials) {
    const error = new Error('Credentials missing!');
    error.status = 400;
    return next(error);
  } else {
    console.log('User: ', User);
    User.auth(credentials.name, credentials.pass, (error, user) => {
      if (error) {
        console.error(error);
        return next(error);
      }

      console.log('setting req.currentAuthUser: ', user);

      req.currentAuthUser = user;
      return next();
    });
  }
};
