var Campground = require("../models/campground");
var Comment = require("../models/comment");


//==============
//all middleware 
//==============

var middlewareObj = {};

// function for authorization (only person who created campsite can edit and delete what they posted)
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
               if(err){
                   res.redirect("/campgrounds")
               } else {
                    //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
                   
               }
            });
        } else {
            req.flash("error", "You Need To Be Logged In to Do That!");
            res.redirect("back");
        }
}

// function for authorization (only person who created comment can edit and delete what they posted)
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
               if(err){
                   res.redirect("/campgrounds")
               } else {
                    //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
                   
               }
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need To Be Logged In to Do That!");
    res.redirect("/login");
}

module.exports = middlewareObj;