var express    = require("express"),
    app        = express(),
    
    //allows you to group form inputs together into one object to access all at once
    bodyParser = require("body-parser"),
    
    //for the database
    mongoose   = require("mongoose"),
    
    //for flash messages
    flash      = require("connect-flash"),
    
    //for authentication
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    
    //to Edit/Update
    methodOverride = require("method-override"),
    
    //for model links
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds")
 
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.Promise = global.Promise;
var databaseUri = process.env.DATABASEURL || "mongodb://john:dragon87@ds135514.mlab.com:35514/yelpcamp";
mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected!`))
      .catch(err => console.log(`Database connection error: ${err.message}`));
      
//mongoose.connect("mongodb://localhost/yelp_camp"); local database

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname  +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); 

//passport configuration
app.use(require("express-session")({
    secret:"Dragonball forever",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware that will be passed through to see if user is logged in on navbar logic (show/hide nav links)
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});