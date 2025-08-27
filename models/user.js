// const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.

// Additionally, Passport-Local Mongoose adds some methods to your Schema. See the API Documentation section for more details.
//INCLUDEING THE  PASSPORT-LOCAL-MONGOOSE
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
    //Passport automaticaly gonna create the Username and password by default in hashed form

});

//USER.PLUGI,IT AUTOMATICALY IMPLEMENT THE HASHING , SALTING , USERNAME, HASHED PASSWORD
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
