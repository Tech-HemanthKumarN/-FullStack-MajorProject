//PHASE-03 PART-A
//MVC--> MODEL, VIEW, CONTROLLER
//MODEL AND VIEW ARE FRONTEND PURPOSE AND CONTROLLER ARE FOR BACKEND PURPOSE

//HERE WE STORING ALL THE {"CALL BACK"-->(req,res)}, TO MAKE OUR PROJECT AND CODE IN MORE READABLE FORMATE

//---------------------REQURING THE THINGS------------------------------------------------------------

//REQUIRING THE LISTINGS
const Listing = require("../models/listing.js");

//REQUIRING THE @mapbox/mapbox-sdk
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

//REQUIRING THE access Token GOTO--> https://github.com/mapbox/mapbox-sdk-js?tab=readme-ov-file
const mapToken = process.env.MAP_TOKEN;

//USING THAT MAP_TOKEN WE CREATED A baseClient GOTO--> https://github.com/mapbox/mapbox-sdk-js?tab=readme-ov-file
const geocodingClient = mbxGeocoding({ accessToken:mapToken });

// _____________________________________________________________________________________________________________
//INDEX ROUTE
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}) //-->THIS IS LIKE {"db.collectionname.find()"}
    res.render("listings/index.ejs", { allListings })
};

//NEW ROUTE
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//SHOW ROUTE
module.exports.showListing = async (req, res) => {
    let { id } = req.params;// USING THIS ID WE NEED TO FIND INDIVIDUL DATA
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews", //path:"reviews", --> means we populating with reviews path(mathlab in listing we get all reviews), 
        populate:{
            path:"author", // for all individual reviews we get author and print this thing in show.ejs where u write Jeo doe
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!"); // CREATING THE FLASH FOR ERROR , WHENEVER,IF WE TRY TO ACCESS THE DELETED LISTING LINK WE GET SOME ERROR,TO MAKE IT CLEAR WE USE THIS , JUST LIKE SUCCESS PART, SAME AS IT IS , AND THEN WE RE-DIRECT IT TO MAIN PAGE
        // USE BOOTSTRAP PORPERTY FOR THIS ALSO JUST LIKE SUCCESS PART IN flash.ejs WHICH IS IN include folder
        res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

//CREATE NEW POST --> ADDING THE NEW POST
module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send()
    // FOR ABOVE CODE GOTO -> https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md

    let url = req.file.path;
    let filename = req.file.filename;
        //HERE WE HAVE WRITTEN, THROWN AN EXPRESSERROR MANY TIMES FOR TITLE, DESC,LOCATION,COUNTRY etc.., this quite defecult to write if condition and throwing expresserror to over come this we use "{joi}" , irst install this by "{npm i joi"
        //NOW CREATE A ANOTHER FILE CALLED schema.js IN MAJOR_PROJECT FOLDER, AND THERE ADD VALIDATIONS and then require that file(schema.js) in app.js, and then use here(below)
        //joi lets you describe your data using a simple, intuitive, and readable language. 
        //GOTO joi.dev website

        // let result = listingSchema.validate(req.body);
        // // sending req.body-->under  listingSchema.validate means listingSchema created inside the joi, huske under we are checking the condition we defined , kya  req.body is  statisfied for req.that condition or kya req.body is validate on that condition. 
        // console.log(result);
        // if(result.err){
        //     throw new ExpressError(400,result.err)
        // } 
        //WE Copied(cut)the above code in the validiti listing function , above index route


        //joi identify the error and print it on the console screen


        // if(!req.body.listing){
        //     throw new ExpressError(400,"Send valid for listing");
        // }
        //400- Bad request
        // let {title,description,image,price,location,country} = req.body; // this is old way make all of this as object like. listing[title],listing[location] etc.. Check in new.ejs , then define like below
        // let listing = req.body.listing;
        // console.log(listing); // Know it will print in terminal only, we can also add this in main page(index route)

        const newListing = new Listing(req.body.listing);

        // if(!newListing.title){
        //     throw new ExpressError(400,"Title is missing");
        // }

        // if(!newListing.description){
        //     throw new ExpressError(400,"Description is missing");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400,"Location is missing");
        // }
        newListing.owner = req.user._id;
        newListing.image = {url,filename};

        newListing.geometry = response.body.features[0].geometry;
        let savedListing = await newListing.save();
        console.log(savedListing);

        req.flash("success","New Listing Created!");// USING THE CONNECT-FLASH // it will popup in the main page that is ("New Lisitng is Created") When Ever u add the new listings
        //goto --> include(floder)-->flash.ejs-->  and we dirctly define the or include the flash.ejs in bolerplate
        //do same for all --> foe deleting the listing and deleting the review adding the review
        res.redirect("/listings");
};

//EDIT ROUTE
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;// USING THIS ID WE NEED TO FIND INDIVIDUL DATA
    const listing = await Listing.findById(id);
       if(!listing){
        req.flash("error","Listing you requested for does not exist!"); // CREATING THE FLASH FOR ERROR , WHENEVER,IF WE TRY TO ACCESS THE DELETED LISTING LINK, WE GET SOME ERROR,TO MAKE IT CLEAR WE USE THIS , JUST LIKE SUCCESS PART, SAME AS IT IS , AND THEN WE RE-DIRECT IT TO MAIN PAGE
        // USE BOOTSTRAP PORPERTY FOR THIS ALSO JUST LIKE SUCCESS PART IN flash.ejs WHICH IS IN include folder
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing,originalImageUrl })
};

//UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
    
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid for listing")
    // } // revome this(if, throw error) not neccessary becz now automaticaly take place by

    let { id } = req.params;// USING THIS ID WE NEED TO FIND INDIVIDUL DATA
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });//{...req.body.listing} --> JAVA SCRIPT BODY

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//DELETE ROUTE
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;// USING THIS ID WE NEED TO FIND INDIVIDUL DATA
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success","Listing Deleted!");
    res.redirect("/listings")
};