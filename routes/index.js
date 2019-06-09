var express = require('express');
var router = express.Router();
var passport = require('../helpers/passport');
var User = require('../models/user');
var middleware = require('../middleware/index');

/**
* Check if a user is logged in, if true next else, retun back
* Basically, i like to call this function auth
*/
function auth(req, res, next){
    if(req.isAuthenticated()) next();
    else {
        req.flash('error', 'You have to login');
        return res.redirect(`back`) // Res.redirect back return the user bact to the formal page just like window.location.history('back')
    }
}

// root route
router.get('/', (req, res) => {
    res.redirect('/blogs');
});

// Auth routes
// show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
router.post('/register', async (req, res, next) => {
    let checkIfEmailExist = await User.findOne({email: req.body.email});
    if(checkIfEmailExist){
        req.flash('error', 'Email Already in use');
        return res.redirect('back')
    }else{
        // Try, catch, will handle error perfectly
        try{
            const user = new User(req.body);
            user.save().then(user => {
                req.flash('success', 'Registration successfull');
                req.logIn(user, err => { // Use this instead of passport.authenticate
                    if(err) return next(err);
                    else return next();
                })
            }).catch(err => console.error(err));
        }catch(err){
            throw new Error(err);
        }
    }
});

// show login form
router.get('/login', (req, res) => {
    res.render('login');
})

// handling login logic
//Process login
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err)
        if (!user) {
            req.flash('error', 'Incorect Email or password')
            return res.redirect(`/login`)
        }
        req.logIn(user, function (err) {
            if (err) return next(err);
            else return res.redirect('/blogs')
        });
    })(req, res, next);
})

router.get('/users/:id', auth, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            req.flash('error', 'Something went wrong there');
            res.redirect('/blogs');
        }
        res.render('users/show', {user: user});
    })
})

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/blogs');
});

module.exports = router;