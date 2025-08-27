//PHASE-02 PART-B VID-03 

//WE USE THIS TO RE-STRACTUER OUR LISTINGS

//Listing related is everything is here now
const express = require("express");
const router =express.Router();

//REQUIREING THE WRAPASYNC ERROR HANDLER FUNCTION
const wrapAsync = require("../utils/wrapAsync.js");

//REQUIREING THE ExpressError ERROR HANDLER FUNCTION
// const ExpressError = require("../utils/ExpressError.js");

// REQUIRING THE JOI (VALIDATION FOR SCHEAMA)
// const Joi = require('joi'); no use, don't require here simply
// const { listingSchema } = require("../schema.js");

//REQUIRING THE LISTINGS
const Listing = require("../models/listing.js");

//REQURING LOGGEDIN and isOwner FUNCTION
const {isLoggedIn,isOwner,validateListing} =  require("../middleware.js");

//REQURING THE LISTINGS AND OTHERS FROM CONTROLLER
const listingController = require("../controllers/listings.js");

// THIS FOR PERFORMING -->entye="multipart/form-data"(new.ejs( from may))
//REQURING THE MULTER GO TO --> https://www.npmjs.com/package/multer
const multer  = require('multer');

//REQURING THE STORGAE FROM ---> cloudConfig.js
const {storage} = require("../cloudConfig.js");

//the files must be upload in the cloud ka storage may, so below replace dest: 'uploads/' to "{storage}"
//REQURING THE Upload
const upload = multer({ storage });


// ________________________________________________________________________________________________________________

//we use this code in middleware.js no need to use this here............

// //Listing Routes are cut form app.js and paste here fo re-straturing our listing
// //LISTNG RELATED EVERYTHING IS HERE NOW

// //HERE WE REMOVE THE "{listings name}" FROM EACH ROUTES (resource name) which is after the slash("/"), becz WE HAVE DEFINED THEM IN APP.JS LIKE THIS --> app.use("/listings",listings); , WE REMOVE ALL OF THIS BECZ ALL OF THAT HAVE COMMAN NAME CALLED "{/listings }"


// const validateListing = (req, res, next) => {

//     //validateListing--> used in create route
//     //listingSchema--> is created in schema.js file
//     let { error } = listingSchema.validate(req.body);
//     // sending req.body-->under  listingSchema.validate means listingSchema created inside the joi, huske under we are checking the condition we defined , kya  req.body is  statisfied for req.that condition or kya req.body is validate on that condition.
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(","); // it contain all details of errors and maped so, all (el)->element details will come out message formate and we joined with the help of comma(,)
//         throw new ExpressError(400, errMsg)
//     }else {
//         next();
//     }
// };
// ________________________________________________________________________________________________

// -----------------------------MVC-------------------------------------------------------
//HERE WE ARE SHIFT ALL THE CALLBACK(req,res) TO controller ke UNDAR, WE IMPLEMENT THE MVC
//IF U WANT TO CHANGE ANY THING GO AND CHANGE THERE

// --------------------------------------   router.route------------------------------------------------------
//IMPLEMENTING "{router.route}",-->HERE WE ARE DEFING THE PATH ONCE AND USE THEM,MAKE IT MORE COMPACT FORM
//SEE HERE "/" router.get and router.post have same path so define them once and use them.

//router.get(index route) and router.post(create route) have same path "/"
router.route("/")
//INDEX ROUTE{MAIN PAGE}
//wrapAsync --> asynchronus ka error handling..
.get(wrapAsync(listingController.index))

//ADDING THE NEW POSTS
//CREATE ROUTE
.post( 
    isLoggedIn,//First request come to this route then next to validateListing, then next wrapAsync and follows
    upload.single('listing[image]'), // THE MULTER STRAT PROCESS INSIDE THE LISTING AND TAKE THE IMAGE DATA TO req.file ke undar
    validateListing, //WE PASS THE "{validateListing}" AS A MIDDLEWARE.IT CHECK THE LISTING WE ARE SENDING IS VALIDATE OR NOT
    
    wrapAsync(listingController.createListing),
);

//NEW ROUTE

// 1) SERVING THE FORM (WRITE THIS ROUTE BEFORE SHOW ROUTE BECZ THER PERFORMING FINDING INDIVIDUAL ID SO , IF U WRITE THIS BELOW SHOW ROUTE IT THINK NEW ROUTE ALSO A ID, SO THAT'S WHY ALWAYS WRITE THIS BEFORE SHOW ROUTE)
router.get("/new",isLoggedIn,listingController.renderNewForm);

//router.get(show route) and router.post(update route) and router.delete have same path "/"

router.route("/:id")
//SHOW ROUTE (to view individual data)
.get( wrapAsync(listingController.showListing))
//UPDATE ROUTE
.put(
    isLoggedIn, // first checking the user is logged in or not
    isOwner, //and then checking, what the user have permission to update ,(require this above frist)
    upload.single('listing[image]'), //THE MULTER STRAT PROCESS INSIDE THE LISTING AND TAKE THE IMAGE DATA TO req.file ke undar
    validateListing, // then c validate
    wrapAsync(listingController.updateListing)
)
//DELETE ROUTE
    .delete(
    isLoggedIn, 
    isOwner, //and then checking, what the user have permission to update ,(require this above frist)
    wrapAsync(listingController.destroyListing)
);

//EDIT ROUTE (ALMOST SAME AS NEW ROUTE)
router.get("/:id/edit",
    isLoggedIn, // first checking the user is logged in or not
     isOwner, //and then checking, what the user have permission to update ,(require this above frist)
    wrapAsync(listingController.renderEditForm)
);
module.exports = router;

// ________________________________________________________________________________________________

//-------------------------THIS IS OLD CODE, above we are implemented router.route-----------------------

// //INDEX ROUTE{MAIN PAGE}
// //wrapAsync --> asynchronus ka error handling..
// router.get("/", wrapAsync(listingController.index));

// //NEW ROUTE
// // 1) SERVING THE FORM (WRITE THIS ROUTE BEFORE SHOW ROUTE BECZ THER PERFORMING FINDING INDIVIDUAL ID SO , IF U WRITE THIS BELOW SHOW ROUTE IT THINK NEW ROUTE ALSO A ID, SO THAT'S WHY ALWAYS WRITE THIS BEFORE SHOW ROUTE)

// router.get("/new",isLoggedIn,listingController.renderNewForm);

//SHOW ROUTE (to view individual data)

// router.get("/:id", wrapAsync(listingController.showListing));

//ADDING THE NEW POSTS
//CREATE ROUTE

// router.post("/", //First request come to this route then next to validateListing, then next wrapAsync and follows
//     isLoggedIn,
//     validateListing, //WE PASS THE "{validateListing}" AS A MIDDLEWARE.IT CHECK THE LISTING WE ARE SENDING IS VALIDATE OR NOT
//     wrapAsync(listingController.createListing));



// //EDIT ROUTE (ALMOST SAME AS NEW ROUTE)

// router.get("/:id/edit",
//     isLoggedIn, // first checking the user is logged in or not
//      isOwner, //and then checking, what the user have permission to update ,(require this above frist)
//     wrapAsync(listingController.renderEditForm));

//UPDATE ROUTE

// router.put("/:id",
//     isLoggedIn, // first checking the user is logged in or not
//     isOwner, //and then checking, what the user have permission to update ,(require this above frist)
//     validateListing, // then c validate
//     wrapAsync(listingController.updateListing));

//DELETE ROUTE

// router.delete("/:id",
//     isLoggedIn, 
//     isOwner, //and then checking, what the user have permission to update ,(require this above frist)
//     wrapAsync(listingController.destroyListing));

// module.exports = router;
