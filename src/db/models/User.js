const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Set up custom email validation
function validator(emailValue) {
  return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(emailValue);
}

const emailValidation = [validator, 'Please enter a valid email.'];

// Schemas
const UserSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'User name is required.'],
  },
  emailAddress: {
    type: String,
    required: [true, 'User email is required.'],
    unique: true,
    lowercase: true,
    validate: emailValidation,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required.'],
  },
});

UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    } else {
      user.password = hash;
      next();
    }
  });
});

UserSchema.statics.auth = function(email, password, cb) {
  User.findOne({ emailAddress: email }, function(error, user) {
    if (error) {
      return cb(error);
    } else if (!user) {
      const error = new Error('User not found.');
      error.status = 401;
      return cb(error);
    }
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        return cb(null, user);
      } else {
        return cb(error);
      }
    });
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
