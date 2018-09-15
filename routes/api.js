var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var data = mongoose.model("Data");
var account = mongoose.model("Accounts");

router.use(function(req,res, next){
    console.log("REQUEST REC");
    if(req.method == 'GET' || req.url =="/u" ||req.url =="/send"){
        // continuez to the next middleware or request handler.
        return next();
    }
    if(!req.isAuthenticated()){
        // user not authenticated, redirect to login page
        return res.redirect('/#signin');
    }
    return next();
});


//send will only receive the messages and store them in the database
router.route("/send")
.get(function(req,res){
    return res.send(200, "Congratulation!!! You've Found it");
})
.post(function(req,res){
    console.log("Received: " + req.body.username + " >>  " + req.body.message);
    var newData = new data();
    newData.message= req.body.message;
    newData.username = req.body.username;
    newData.save(function(err,post){
        if(err){
            //TODO: change this for deployment
            return res.send(500, err);
        }
        console.log("Data saved successfully");
        return res.json({state: 'success'});
    });
    //res.send({message: "TODO: save the post", user: req.body.user, message: req.body.messaage});
});

router.route("/u")
.post(function(req,res){
    //console.log("SENDING REQUEST: "+ req.body.username);
    account.find({username: req.body.username}, function(err,data){
        if(err){
            //console.log("message: user not found");
            return res.send(500,"false");
        }
        if(data == ""){
            //console.log("DB NOT FOUND");
            return res.send(200, "false");
        }
        //console.log("message: user found");
        return res.send(200,{state:'success', value: "true"});
    });
})
.get(function(req,res){
    res.send(200,"HELLO");
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