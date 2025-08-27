if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");// requiring the express 
const app = express(); //CREATING THE SERVER APP
const path = require("path"); //REQUIRING THE PATH
const methodOverride = require('method-override'); //REQUIRING THE METHOD OVERRINGING

const ejsMate = require("ejs-mate"); // requiring the ejs-mate (this is the another tool used for styling purpose, it helps to create templates layouts)
//app.engine('ejs', ejsMate); we have to use both above and below

//REQUIREING THE ExpressError ERROR HANDLER FUNCTION
const ExpressError = require("./utils/ExpressError.js");

//REQUIRING THE SESSION --> to install--> npm i express-session -->THEN USE BELOW
const session = require("express-session");

//REQUIREING THE connect- mongos
const MongoStore = require('connect-mongo');

//REQUIRING THE CONNECT FLASH( TO INSTALL--> npm i connect-flash) -->THEN USE BELOW
const flash = require("connect-flash");

//REQUIRING THE PASSPORT
const passport = require("passport");

const LocalStrategy =  require("passport-local");

const User = require("./models/user.js")

// REQUING THE MONGOOSE
const mongoose = require("mongoose");

//REQUIREING THE WRAPASYNC ERROR HANDLER FUNCTION, 
// "{THIS CODE NO USE IN THIS FILE,}"
// const wrapAsync = require("./utils/wrapAsync.js");

//REQUIRING THE LISTINGS,
// "{THIS CODE NO USE IN THIS FILE,}"
// const Listing = require("./models/listing.js");

// //REQUIRING THE JOI (VALIDATION FOR SCHEAMA),
// "{THIS CODE NO USE IN THIS FILE,}"
// // const Joi = require('joi'); no use, don't require here simply

// const { listingSchema, reviewSchema } = require("./schema.js");

// //REQUIRING THE LISTINGS,
// ("THIS CODE NO USE IN THIS FILE,")
// const Review = require("./models/review.js");

//REQURING THE ROUTES LISTING.JS (FOR RE-STRACTURING THE LISTINGS )
const listingRouter = require("./routes/listing.js");

//REQURING THE ROUTES REVIEW.JS (FOR RE-STRACTURING REVIEWS)
const reviewRouter = require("./routes/review.js");

//REQURING THE ROUTES user.JS 
const userRouter = require("./routes/user.js");
// ___________________________________________________________________________________________________
app.engine('ejs', ejsMate);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // CHANGE THE RAW DATA INTO WELL STRACTURED FORMATE

app.use(express.static(path.join(__dirname, "public")));//THIS FOR STATIC FILE STYLING PURPOSE

app.use(methodOverride('_method'))//REQUIRING THE METHOD OVERRINGING

// FOR BELOW LINK GOTO-->https://mongoosejs.com/ ,<-- THIS WEBSITE
// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'; // YOU HAVE DEFINE THIS URL HERE ONLY IN THE TOP BEFORE MAIN() OTHERWISE YOU CON'T ACCESS THE MONGO_URL

// THE URL WAS STORED IN .env
const dbUrl = process.env.ATLASDB_URL;

main()  // I AM CALLING THE MAIN FUNCTION
    .then(() => {
        console.log("connected to DB")
    })
    .catch((err) => {
        console.log(err);
    });
    async function main() { // I AM CALLING THE MAIN FUNCTION (ABOVE ONE)
    await mongoose.connect(dbUrl);
}
// ____________________________________________________________________________________________________________________

//PHASE-03 PART-D VID-2(11:20)
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error",() =>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

//DEFING THE SESSION OPTIONS
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000, // 7day-24hrs-60min-60sec-1000milisec
        maxAge: 7 * 2 * 60 * 60 * 1000,
        httpOnly:true,
    },
};

//CREATING ROOT
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

// _____________________________________________________________________________________________________

//USING THE SESSION
app.use(session(sessionOption));

//USING THE FLASH
app.use(flash()); //YOU SHOULD USE THIS BEFORE ROUTES 

// _______________________________________________________________________________________________________
//INTIALIZING THE PASSPORT (SESSION IS IMPORTENT FOR PASSPORT)
app.use(passport.initialize());

app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// authenticate() Generates a function that is used in Passport's LocalStrategy
// serializeUser() Generates a function that is used by Passport to serialize users into the session
// deserializeUser() Generates a function that is used by Passport to deserialize users into the session

// _____________________________________________________________________________________________________________

//CREATING THE MIDDLEWARE FOR SUCCESS INSIDE THE respose ka locals ke undar..
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;// in navbar.ejs we can't access the req.user directly, so that's why i am defing that here, means i ma storing the "{req.user}" ka information in "{currUser}" varilable me, so now you can us "{currUser}" in navbar.ejs 
    //goto --> include(floder)-->flash.ejs-->  and we dirctly define the or include the flash.ejs in bolerplate
    next();
});
// _________________________________________________________________________________________________________________________
//DEMO FOR SIGNUP

// app.get("/demouser",async(areq,res)=>{
//     let fakeUser = new User({
//         email:"student@getMaxListeners.com",
//         username:"delta-student",
//     });

//     let registeredUser = await User.register(fakeUser,"helloWorld");
//     res.send(registeredUser);
// })
// _________________________________________________________________________________________________________
app.use("/listings",listingRouter); //HERE WE ARE DEFINING THE "{listings}" , WE REMOVE ALL listings name in listing.js which is in routes folder ,WE REMOVE ALL OF THAT FROM listing.js BECZ ALL OF THAT HAVE COMMAN NAME CALLED "{/listings }"AND WE DEFINED THEM HERE.

app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);
// ________________________________________________________________________________________________________________________
//THIS U CAN REMOVE , NO USE FROM THIS

//Test Listing Insertion Endpoint
//Route to test inserting a sample listing into the database
//In Mongoose (which is used with MongoDB), a Model is a class that lets you create and interact with documents in a collection.
// So:
// Listing = Model (JavaScript class)
// new Listing(...) = creates a new document (not yet saved in the database)
// Under the hood, Mongoose uses the model to talk to the MongoDB collection (e.g., listings)

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({ // LISTING IS A MODEl
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// });

// _________________________________________________________________________________________________________________________

//----------------------------------------Don't Create anything below this(only this two)---------------------------------------------------------------------

// 404 Catch-All Route
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// }); if u get error because of using the "*" first install the "npm install express@4 " then probleam will resolve

// ERROR-HANDLING MIDDLEWARE
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
//CREATING THE MIDDLEWARE
// ERROR-HANDLING MIDDLEWARE
//"*"--> match to all incoming request 
//for example if run localhost:8080/random insted this one localhost:8080/listings, then u will get Page not found error
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message, err });
    // res.status(statusCode).send(message);
});

//APP LISTING ROUTE
app.listen(8080, () => {
    console.log(`App is listening on the port${8080}`);
});
