// THIS IS FOR CREATING REVIEWS FOR OUR EACH LISTING(FOR EACH HOTELS LIKE RATNGS , COMMENT etc..)
//AND WE ALSO CREATED AN REVIEWS ARRAY IN listing.js
//CREATEING THE MODEL(SCHEAMA) AND THEN EXPORT THE SCHEAMA THEN WE USE IT IN APP.JS

// I HAVE REQUIRED MONGOOSE
const mongoose = require("mongoose");

const Schema = mongoose.Schema;// TO AVOID WRTTING mongoose.Schema agin and agin

//CREATEING THE SCHEAMA
const reviewSchema = new Schema({
    comment:{
      type:String,
      maxlength:5000,
    },

    rating:
    {
        type:Number,
        min:1,
        max:5
    },
    
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

module.exports = mongoose.model("Review",reviewSchema);
