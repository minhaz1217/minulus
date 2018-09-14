var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var data = mongoose.model("Data");

//send will only receive the messages and store them in the database
router.route("/send")
.get(function(req,res){
    return res.send(200, "Congratulation!!! You've Found it");
})
.post(function(req,res){
    console.log("Received: " + req.body.user + " >>  " + req.body.message);
    var newData = new data();
    newData.message= req.body.message;
    newData.username = req.body.user;
    newData.save(function(err,post){
        if(err){
            //TODO: change this for deployment
            return res.send(500, err);
        }
        console.log("Data saved successfully");
        return res.json(post);
    });
    //res.send({message: "TODO: save the post", user: req.body.user, message: req.body.messaage});
});

router.route("/posts")
.post(function(req,res){
    console.log("HELLO: "+ req.body.user);
    data.find({username: req.body.user}, function(err, data){
        if(err){
            return res.send(500, err);
        }
        return res.json(200, data);
    });
    //res.send(200,"HELLO");
    
})
.get(function(req,res){
    res.send(200,"HI");
});


module.exports= router;