//HERE WE RE-STRACTURING THE REVIEWS CONTENT, BY COPYING FROM app.js TO review.js (routes folder)

const express = require("express");
const router = express.Router({mergeParams:true});

//REQUIREING THE WRAPASYNC ERROR HANDLER FUNCTION
const wrapAsync = require("../utils/wrapAsync.js");

// //REQUIREING THE ExpressError ERROR HANDLER FUNCTION
// const ExpressError = require("../utils/ExpressError.js");

// //REQUIRING THE JOI (VALIDATION FOR SCHEAMA)
// // const Joi = require('joi'); no use, don't require here simply
// const { reviewSchema } = require("../schema.js");

//REQUIRING THE LISTINGS
const Review = require("../models/review.js");

//REQUIRING THE LISTINGS
const Listing = require("../models/listing.js");


//REQURING LOGGEDIN and isOwner FUNCTION
const {validateReview, isLoggedIn,isReviewAuthor} =  require("../middleware.js");

//REQURING THE REVIEWS CONTROLLER
const reviewController = require("../controllers/reviews.js")

// _______________________________________________________________________________________________________________
//we are using this in middleware.js as a middleware so no need to use this here

// //VALIDATE LISTING FUNCTION
// const validateReview = (req, res, next) => {
//     //validateListing--> used in create route
//     ///listingSchema--> is created in schema.js file
//     let { error } = reviewSchema.validate(req.body);
//     // sending req.body-->under  listingSchema.validate means listingSchema created inside the joi, huske under we are checking the condition we defined , kya  req.body is  statisfied for req.that condition or kya req.body is validate on that condition. 
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(","); // it contain all details of errors and maped so, all (el)->element details will come out message formate and we joined with the help of comma(,)
//         throw new ExpressError(400, errMsg)
//     }
//     else {
//         next();
//     }
// };
// _____________________________________________________________________________________________________________________
// "Review "refers to the Mongoose model you created in your review.js file (something like module.exports = mongoose.model("Review", reviewSchema);).
// What’s happening here:
// req.body.review → This is the review data the client sent in the POST request body (probably via a form or JSON).
//wrapAsync --> for error hendling purpose

//FOR REVIEWS KE COMMAN PART IS THIS -->/listings/:id/reviews SO CUT THIS FROM HERE AND USE THIS IN APP.JS FILE

//---------------------------------MVC------------------------------------------------------
//HERE WE ARE SHIFT ALL THE CALLBACK(req,res) TO controller ke UNDAR, WE IMPLEMENT THE MVC
//IF U WANT TO CHANGE ANY THING GO AND CHANGE THERE

//CREATING THE POST REVIEWS ROUTE (reviews ka post route)
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview));

//REVIEWS DELETE ROUTE
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

//NOTE :(PHASE-2 PART B VID-10)--> (for above) Whenever we are deleteing the listings, when findByIdAndDelete call hoga for any listing as a middleware hamari listing.js ke under listingSchema.post mongoose middleware also call hoga, and then (this line from listing.js)->await Review.deleteMany({ _id: { $in: listing.reviews } }) it delete all the reviews which is corresponding to it

module.exports = router;
