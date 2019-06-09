const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//Serialize user
passport.serializeUser((user, done) => {
    console.log(user.username + ' has logged in')
    done(null, user.id);
})

//Deserialize user
passport.deserializeUser((id, done) => {
    //console.log(id)
    User.findById(id, (err, user) => {

        done(err, user);
      });
})

//Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    User.findOne({email: email}, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false, {message: 'Incorrect Username'});
        user.comparePassword(password, (err, isMatch) => {
            if(isMatch){
                return done(null, user);
            }else{
                return done(null, false, { message: 'Incorrect password.' });
            }
        })
    })
}))

module.exports = passport;
