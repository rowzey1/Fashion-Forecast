// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async function(req, email, password, done) {
        try {
            console.log('Request body:', req.body); // Log the request body

        if (!email) {
            return done(null, false, req.flash('signupMessage', 'Email is required.'));
        }

            const username = req.body.username || email; // Use email as fallback
            console.log('Checking for existing user with email:', email, 'or username:', username);
            const existingUser = await User.findOne({ 
                $or: [
                    { 'local.email': email },
                    { 'local.username': username }
                ]
            });

            if (existingUser) {
                console.log('Existing user found:', existingUser);
                return done(null, false, req.flash('signupMessage', 'That email or username is already taken.'));
            }

            const newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            newUser.local.username = username

            await newUser.save();
            console.log('New user created:', newUser);
            return done(null, newUser);
        } catch (err) {
            console.error('Error during signup:', err);
            return done(err);
        }
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async function(req, email, password, done) {
        try {
            const user = await User.findOne({ 
                $or: [
                    { 'local.email': email },
                    { 'local.username': email }
                ]
            });

            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));


};
