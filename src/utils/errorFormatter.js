module.exports = error => {
  return { ...error, status: error.name === 'ValidationError' ? 400 : 500 };
};
