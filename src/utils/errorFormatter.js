/**
 * return error pbject with added status code
 * @param error
 * @returns {{[p: string]: *}}
 */
module.exports = error => ({
  ...error,
  status: error.name === 'ValidationError' ? 400 : 500,
});
