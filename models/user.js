var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    avatar: String,
    email: String, 
    password: String
})

userSchema.plugin(passportLocalMongoose);

//Hash password with bcrypt before saving
userSchema.pre('save', function (next) {
  var user = this;
  var SALT_FACTOR = 12;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);