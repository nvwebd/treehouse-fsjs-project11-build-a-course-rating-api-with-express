/**
 * return error pbject with added status code
 * @param error
 * @returns {{[p: string]: *}}
 */
module.exports = error => ({
  ...error,
  message: error.errmsg ? error.errmsg : error.message,
  status:
    error.name === 'ValidationError' || error.name === 'MongoError' ? 400 : 500,
});
