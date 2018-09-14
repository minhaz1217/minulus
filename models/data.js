var mongoose = require("mongoose");
var dataSchema = new mongoose.Schema({
    username: String,
    message: String,
    created_at: {type: Date, default: Date.now}
});

mongoose.model("Data", dataSchema);