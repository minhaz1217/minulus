var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require("mongoose");
var account = mongoose.model("Accounts");
var datas = mongoose.model("Data");
module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user._id);
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		// return user object back

		account.findById(id, function(err, user){
			console.log("Deserializing user: "+ user.username);
			if(err){
				done("ERROR");
			}else{
				done(null, user);
			}
		});
		//console.log('deserializing user:',user.username);
	});

	passport.use('signin', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			
			account.findOne({"username" : username}, 
			function(err, user){
				if(err){
					return done("Error in username database");
				}
				if(!user){
					console.log("Username not found");
					return done(null, false);
				}
				if(!isValidPassword(user, password)){
					console.log("Invalid password");
					return done(null, false);
				}
				return done(null,user);
			});
			
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {
			account.findOne({'username': username}, function(err, user){
				if(err){
					console.log("Error in signup");
					return done(null,false);
				}
				if(user){
					console.log("Username already exists");
					return done(null, false);
				}else{
					var newAccount = new account();
					newAccount.username = username;
					newAccount.password = createHash(password);
					newAccount.save(function(err){
						if(err){
							console.log("Error while saving");
							return done(null, false);
						}
						console.log(newAccount.username + " registration successful");
						var newMessage = new datas();
						newMessage.message = "Please accept my heartfelt thank you for trying out this project. You have no idea how much it means to me that you are here. -minhaz";
						newMessage.username = newAccount.username;
						newMessage.save(function(err){
							if(err){
								console.log("Error in saving the first message");
							}
						});
						return done(null, newAccount);
					});
				}
			});
			
		})
	);

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
