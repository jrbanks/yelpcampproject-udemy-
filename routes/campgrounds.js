var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//===================================
//INDEX ROUTE - show all campgrounds
//===================================
//index route
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
        
}); 

//=========================================
//CREATE ROUTE - add new campgrounds to DB
//=========================================

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    //where we send the campgrounds to make a new one 
    //(get data from form and add to campgrounds array)
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author:author}
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
            //(redirect back to campgrounds page)
            res.redirect("/campgrounds");
       }
    });
});

//================================================
// NEW ROUTE - show form to create new campground
//================================================

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

//=============================================
// SHOW ROUTE - shows info about one campground
//=============================================

router.get("/campgrounds/:id", function(req, res){
   //find the campground with provided id
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
          console.log(err);
      } else{
          console.log(foundCampground);
          //render show template with that campground
          res.render("campgrounds/show", {campground: foundCampground}); 
      }
   });
   
});

//=====================
//edit campground route - 
//=====================

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
     Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
     });
});

//=======================
//update capmground route -
//=======================

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   //find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
          res.redirect("/campgrounds");
      } else {
          //redirect somewhere(showpage)
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
   
});

//========================
//Destory campground route -
//========================

router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds");
      }
   });
});


module.exports = router;