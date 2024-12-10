// load the things we need
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');


// define the schema for our user model
const userSchema = mongoose.Schema({

    local: {
        username: {
            type: String,
            unique: true, // Ensure username is unique
            sparse: true  // Allow null values to not conflict with unique constraint
        },
        email: {
            type: String,
            unique: true, // Ensure email is unique
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
   

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
