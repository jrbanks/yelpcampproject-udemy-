var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var data = [
    {
        name: "Clouds Rest", 
        image: "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
        description: "Lorem ipsum amet, Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu  Curabitur sodales ligula in libero."
    },
    {
        name: "Clouds Rest", 
        image: "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
        description: "Lorem ipsum amet,  elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad  Curabitur sodales ligula in libero."
    },
    
]


function seedDB(){
    //Remove all campgrounds
     Campground.remove({}, function(err){
       if(err){
           console.log(err);
       } 
       console.log("removed camprounds!");
           //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }  else {
                    console.log("added a campground");
                   //create a comment
                    Comment.create(
                        {
                            text: "this spot is great",
                            author:"Homer"
                       }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created a new comment");
                            }
                            
                        });
                }   
            });
        });
        
    });
    //add a few comments
}



module.exports = seedDB;