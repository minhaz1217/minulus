var mongoose = require("mongoose");
var usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    created_at: {type: Date, default: Date.now}
});

mongoose.model("Accounts", usersSchema);