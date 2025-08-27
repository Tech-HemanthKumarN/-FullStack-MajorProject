//REQUIRING THE Listing
const Listing =require("./models/listing");

//REQUIRING THE Reviews
const Review = require("./models/review.js");

//REQUIREING THE ExpressError ERROR HANDLER FUNCTION
const ExpressError = require("./utils/ExpressError.js");

//REQUIRING THE JOI (VALIDATION FOR SCHEAMA)
// const Joi = require('joi'); no use, don't require here simply
const { listingSchema,reviewSchema} = require("./schema.js");



// ______________________________________________________________________________

//make sure the user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //save the redirectUrl
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

//MAKEING THE  req.session.redirectUrl EASY TO ACSSESS BY USING locals
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
// ___________________________________________________________________________________________________________
//CREATEING THE MIDDLEWAR, WHICH HELPS TO POPUP THE FALSH MESSAGE WHENEVER YOU TRY TO EDIT THE OTHERS LISTINGS
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id); //Here we first finding the {"ID"}, to check that the user information is correct or not, who is going to update, we have stored that things in "{listing}" variable
    if(!listing.owner._id.equals(res.locals.currUser._id)){ // we are checking that what if the "{!listing.owner._id.equals(currUser._id)}",
    req.flash("error","You are not the owner of this listings!"); //  then we have to flash the error message ,
    return res.redirect(`/listings/${id}`); //then agin redirect to show route
    }
    next();
};

// _______________________________________________________________________________________________________________
//Listing Routes are cut form app.js and paste here fo re-straturing our listing
//LISTNG RELATED EVERYTHING IS HERE NOW

//HERE WE REMOVE THE "{listings name}" FROM EACH ROUTES (resource name) which is after the slash("/"), becz WE HAVE DEFINED THEM IN APP.JS LIKE THIS --> app.use("/listings",listings); , WE REMOVE ALL OF THIS BECZ ALL OF THAT HAVE COMMAN NAME CALLED "{/listings }"
 module.exports.validateListing = (req, res, next) => {
    //validateListing--> used in create route
    //listingSchema--> is created in schema.js file
    let { error } = listingSchema.validate(req.body);
    // sending req.body-->under  listingSchema.validate means listingSchema created inside the joi, huske under we are checking the condition we defined , kya  req.body is  statisfied for req.that condition or kya req.body is validate on that condition.
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(","); // it contain all details of errors and maped so, all (el)->element details will come out message formate and we joined with the help of comma(,)
        throw new ExpressError(400, errMsg)
    }else {
        next();
    }
};
// ______________________________________________________________________________________________________________

//VALIDATE-REVIEW LISTING FUNCTION
module.exports.validateReview = (req, res, next) => {
    //validateListing--> used in create route
    ///listingSchema--> is created in schema.js file
    let { error } = reviewSchema.validate(req.body);
    // sending req.body-->under  listingSchema.validate means listingSchema created inside the joi, huske under we are checking the condition we defined , kya  req.body is  statisfied for req.that condition or kya req.body is validate on that condition. 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(","); // it contain all details of errors and maped so, all (el)->element details will come out message formate and we joined with the help of comma(,)
        throw new ExpressError(400, errMsg)
    }
    else {
        next();
    }
};

// _____________________________________________________________________________________________________________

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params; //fetching the reviewid from req.params..
    let review = await Review.findById(reviewId); //Here we first finding the {"ID"}, to check that the user information is correct or not, who is going to update, we have stored that things in "{listing}" variable
    if(!review.author._id.equals(res.locals.currUser._id)){ // we are checking that what if the "{!listing.owner._id.equals(currUser._id)}",
    req.flash("error","You are not the author of this reviews!"); //  then we have to flash the error message ,
    return res.redirect(`/listings/${id}`); //then agin redirect to show route
    }
    next();
};