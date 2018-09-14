var LocalStrategy = require("passport-local").Strategy;
var bCrypt = require('bcrypt-nodejs');
var users = {};
module.exports = function(passport){

	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		return done(null, user.username);
	});

	passport.deserializeUser(function(username, done) {
        // return user object back
		return done(null, users[username]);

	});



    passport.use("signin", new LocalStrategy({
        passReqToCallBack : true
    },
    function(req, username, password, done){
        if(!users[username]){
            return done("User not found", false);
        }
        if(!isValidPassword(users[username], password)){
            return done("INVALID username or password", false);
        }
        console.log("SIGNED IN");
        return done(null , users[username]);
    }
    ));



    
    passport.use("signup", new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done){
        //console.log("REQ" + username + " " + password);
        
        if(users[username]){
            console.log("USER ALREADY");
            return done("User already exists", true);
        }

        users[username] = {
            username: username,
            password: createHash(password)
        };
        console.log("SIGNED UP: "+ username);
        return done(null , users[username]);
    }
    ));

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };


};
