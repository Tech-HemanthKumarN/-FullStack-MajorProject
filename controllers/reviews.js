//PHASE-03 PART-A
//MVC--> MODEL, VIEW, CONTROLLER
//MODEL AND VIEW ARE FRONTEND PURPOSE AND CONTROLLER ARE FOR BACKEND PURPOSE

//HERE WE STORING ALL THE {"CALL BACK"-->(req,res)}, TO MAKE OUR PROJECT AND CODE IN MORE READABLE FORMATE


//REQUIRING THE LISTINGS
const Review = require("../models/review.js");

//REQUIRING THE LISTINGS
const Listing = require("../models/listing.js");


//---------------------REQURING THE THINGS------------------------------------------------------------

//CREATING THE POST REVIEWS ROUTE (reviews ka post route)
module.exports.createReview = async (req, res) => {
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); // newReview is  fetched

    newReview.author = req.user._id; // specify the author
    console.log(newReview); // printing newReview
    listing.reviews.push(newReview); // pushing the newReviews

    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

//REVIEWS DELETE ROUTE
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId); //WHEN findByIdAndDelete ko call keya Review delete hogaya

    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};