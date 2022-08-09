const mongoose = require("mongoose");

var mongoDB = "mongodb+srv://user:user@cluster0.ovrksow.mongodb.net/userAuth?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {
    
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("connected to db");
});

module.exports = db;