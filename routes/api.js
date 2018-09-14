var express = require("express");
var router = express.Router();


router.route("/posts")
.get(function(req, res){
    return res.send(200, "HELLO WORLD");
});

//send will only receive the messages and store them in the database
router.route("/send")
.get(function(req,res){
    return res.send(200, "Congratulation!!! You've Found it");
})
.post(function(req,res){
    console.log(req.body.message);
    res.send(200,req.body.user);

    //res.send({message: "TODO: save the post", user: req.body.user, message: req.body.messaage});
});

router.route("/posts/:user")
.post(function(req,res){
    // match the user wtih the usernames in the database and send their minuls back to them
    // the user MUST BE LOGGED IN
});

















// user loging
router.route("/signin")
.post(function(req,res){
    console.log("SIGNUP REQUEST");
    res.send(200, "REQUEST RECIEVED");
    // match password and username with those in the database
});

router.route("/signup")
.post(function(req,res){
    console.log("SIGNUP REQUEST");
    res.send(200, "REQUEST RECIEVED");
    // save the username password and created at in the database
});














module.exports= router;