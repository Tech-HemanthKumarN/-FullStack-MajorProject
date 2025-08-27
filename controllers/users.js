//PHASE-03 PART-A
//MVC--> MODEL, VIEW, CONTROLLER
//MODEL AND VIEW ARE FRONTEND PURPOSE AND CONTROLLER ARE FOR BACKEND PURPOSE

//HERE WE STORING ALL THE {"CALL BACK"-->(req,res)}, TO MAKE OUR PROJECT AND CODE IN MORE READABLE FORMATE


const User =  require("../models/user.js");
//---------------------REQURING THE THINGS------------------------------------------------------------


//GET SIGNUP ROUTE
module.exports.renderSignupForm =(req,res)=>{
    res.render("users/signup.ejs");
}

//POST SIGNUP ROUTE
module.exports.signup = async (req,res)=>{
    try{
    let { username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
};

//GET LOGIN ROUTE
module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
};

//POST LOGIN ROUTE
module.exports.login =  async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); // here we are, whenever we login it has to automaticaly redirect to addnewlisting page., by using "{req.session.redirectUrl}", we have defined it in "{middleware.js}"
    //but the problem is we can't acsses "{req.session.redirectUrl}" it gave some error so we are usinthe "{local}" in middleware.js we have done this {"res.locals.redirectUrl = req.session.redirectUrl;"}
    // so use res.locals.redirectUrl here, 
    //agin we are faceing one problem that is, whenever we try to login from main page it gave an error that is "{page not found}"
    //to overcome this error we write this lines {" let redirectUrl = res.locals.redirectUrl || "/listings"; res.redirect(redirectUrl);"} ... now the problem is resolved
};

//FOR LOGOUT PUROSE (LOGOUT ROUTE)
module.exports.logout = (req,res)=>{
    req.logout((err) =>{ // to log out the user and during logout if we get error it will come and store int err parameter
        if(err){
        return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    }) 
};