// 🔥 GOAL OF THIS SCRIPT
// You are:
// Connecting to a MongoDB database
// Deleting all existing data in the Listing collection (like cleaning up)
// Inserting fresh new data from a file called data.js
// This is called database seeding or initializing.

// Imagine this script is like cleaning your room (deleteMany) and then decorating it with fresh furniture (insertMany).
// So whenever you run this script → old mess is gone → new nice data is added!

//REQUIRING THE MONGOOSE
const mongoose = require("mongoose");

//REQUIRING THE DATA.JS(You're importing the object exported from data.js.)
const initData = require("./data.js");

// You're importing the Listing model (not a collection).
//A model is like a template/schema that defines what a listing looks like (title, price, location, etc.)
const Listing = require("../models/listing.js");

// FOR BELOW LINK GOTO-->https://mongoosejs.com/ ,<-- THIS WEBSITE
// This connects your app to MongoDB using mongoose.connect().
// main() is an async function being called to perform the connection.
// If successful: connected to DB
// If error: console.log(err)
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'; // YOU HAVE DEFINE THIS URL HERE ONLY IN THE TOP BEFORE MAIN() OTHERWISE YOU CON'T ACCESS THE MONGO_URL
main()  // I AM CALLING THE MAIN FUNCTION
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err);
});
async function main() { // I AM CALLING THE MAIN FUNCTION (ABOVE ONE)
    await mongoose.connect(MONGO_URL);
}

const initDB =  async () =>{
    await Listing.deleteMany({});// IF MANY DATA ((LIKE A RANDOM DATA)IS exsist IN GIT BASH(MONGOOSH SHELL), IT GONE CLEAR EVERYTHING THERE, NOW ALL DATA WILL BE GET DELETED 
    //AND THEN WE INSERT NEW DATA INTO IT. USING INSERTMANY
    initData.data = initData.data.map((obj)=>({...obj,owner:"68a194ffda48007761e8b085"}));
    await Listing.insertMany(initData.data);// Here initDB is a OBJECT AND WE ACCESSING KEY DATA-->{" data"}  init.
    console.log("Data was intialized");
}

initDB();
//CALLING THE initDB FROM HERE
//This actually runs the initialization process:
// Delete old data
// Insert new data
