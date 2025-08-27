//CREATEING THE MODEL(SCHEAMA) AND THEN EXPORT THE SCHEAMA THEN WE USE IT IN APP.JS

// I HAVE REQUIRED MONGOOSE
const mongoose = require("mongoose");

const Schema = mongoose.Schema;// TO AVOID WRTTING mongoose.Schema agin and agin

// requireing the reviews
const Review = require("./review.js");
const { string } = require("joi");

//CREATEING THE SCHEAMA
const listingSchema = new Schema({
  title: {
    type: String,
    maxlength: 500,
    required: true
  },

  description: String,

  //HERE U HAVE TO DO TWO THINGS ONE IS FILENAME PART AND ANOTHER PART IS URL 
  image: {
    // filename: {
    //   type: String,
    //   default: "listingimage"
    // },
    // url: {
    //   type: String,
    //   default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //   set: (v) =>
    //     v === ""
    //       ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //       : v
    // }

    url:String,
    filename:String,
  },
  //set:(v)=> v=== " "? link:v its like a ternary operator

  price: Number,

  location: String,

  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,// we are storing all the reviews for particullar hotels objectid's in the "reviews" array
      ref: "Review",//Review--> model name
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },

  // go and implement this one
  // category:{
  //   type:String,
  //   enum:["mountains", "rooms", "arctic", "frames", "deserts"]
  // }
});

//if we delete the reviews then its id also get deletedm okayy,
//but if delete complete listing the reviews also need to get delete. to do this, what we have to do is --> we have to create post mongoose middleware inside the listing.js
//we have to use review model, to use this we need require, above we required the "{review.js}"
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } }); //SO HERE WE ARE DELETEING THE REVIEWS WHICH IS PRESENT INTHE "{listing}" 
  }
});
//NOTE :(PHASE-2 PART B VID-10)--> Whenever we are deleteing the listings (app.js->//REVIEWS DELETE ROUTE), when findByIdAndDelete call hoga for any listing as a middleware hamari listing.js ke under listingSchema.post mongoose middleware also call hoga, and then (this line from listing.js)->await Review.deleteMany({ _id: { $in: listing.reviews } }) it delete all the reviews which is corresponding to it. 


//CREATING THE MODEL Listing 
const Listing = mongoose.model("Listing", listingSchema);

//EXPORTING THE MODEL TO USE IT IN OTHER FILES
module.exports = Listing;


