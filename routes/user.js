const express = require("express");
const router = express.Router();
const User =  require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js");

//REQURING THE REVIEWS CONTROLLER
const userController = require("../controllers/users.js");

// --------------------------------------   router.route------------------------------------------------------
//IMPLEMENTING "{router.route}",-->HERE WE ARE DEFING THE PATH ONCE AND USE THEM,MAKE IT MORE COMPACT FORM
//SEE HERE "/" router.get(signup) and router.post(signup) have same path so define them once and use them.

//FOR SIGNUP
router.route("/signup")
.get(userController.renderSignupForm) //GET SIGNUP ROUTE
.post(wrapAsync(userController.signup));//POST SIGNUP ROUTE

//FOR LOGIN
router.route("/login")
.get(userController.renderLoginForm) //GET LOGIN ROUTE
//POST LOGIN ROUTE
.post(//whenever we log-in, saveRedirectUrl it will save the RedirectUrl.then we login with passport then agin the req.sessionsay redirectUrl delete hogaya..
    saveRedirectUrl, // we have defined  this in middleware.js
    passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash:true,
    }),
    userController.login  // HERE ACTUALL LOGIN PASSPORT ONLY DO FOR SIMPLICITILY WE ARE WRITEING THIS
);

//FOR LOGOUT PUROSE (LOGOUT ROUTE)
 router.get("/logout",userController.logout);
 
module.exports = router;

// --------------------------------------THIS IS OLD CODE, ABOVE IS NEW ONE(USING router.route)------------------------------------

// //GET SIGNUP ROUTE
// router.get("/signup",userController.renderSignupForm);

// //POST SIGNUP ROUTE
// router.post("/signup",wrapAsync(userController.signup));

// //GET LOGIN ROUTE
// router.get("/login",userController.renderLoginForm);

// //POST LOGIN ROUTE
// //passport.authenticate() middleware used to check that user is exsist or not
// router.post("/login", //whenever we log-in, saveRedirectUrl it will save the RedirectUrl.then we login with passport then agin the req.sessionsay redirectUrl delete hogaya..
//     saveRedirectUrl, // we have defined  this in middleware.js
//     passport.authenticate("local",{
//         failureRedirect:'/login',
//         failureFlash:true,
//     }),
//     userController.login  // HERE ACTUALL LOGIN PASSPORT ONLY DO FOR SIMPLICITILY WE ARE WRITEING THIS
// );

// //FOR LOGOUT PUROSE (LOGOUT ROUTE)
//  router.get("/logout",userController.logout);
 
// module.exports = router;
