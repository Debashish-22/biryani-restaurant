const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy({
    usernameField: 'phone',
    passReqToCallback: true

}, async (req, phone, password, done) => {

    try {

        let user = await User.findOne({
            phone: phone
        });

        if (!user) {
            req.flash('error', "Invalid phone/password!");
            return done(null, false);
        }

        let passwordCheck = await bcrypt.compare(password, user.password);
    
        if (!passwordCheck) {
            req.flash('error', "Invalid phone/password!");
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log(err);
        return done(err);
    };
}));

passport.serializeUser(function (user, done) {

    return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {

        return done(err, user);
    });
});

passport.setAuthenticatedUser = (req, res, next) => {

    let userData = req.user;

    if (req.isAuthenticated()) {
        res.locals.user = {
            id: userData.id,
            name: userData.name,
            phone: userData.phone,
            address: userData.address,
        };
    };
    next();
};

const checkAuthentication = (req, res, next) => {

    if (req.isAuthenticated()) {
        return next();
    };
    return res.redirect('/user/login')
};

const admin = (req, res, next) => {

    if (req.isAuthenticated() && req.user.phone === process.env.ADMIN) {
        return next();
    };
    return res.redirect('/user/login')
};

module.exports = {
    passport,
    checkAuthentication,
    admin
};