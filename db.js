const mongoose = require("mongoose");
require("dotenv").config();


const Schema = mongoose.Schema;
const objectId = Schema.objectId;

const userSchema = new Schema({
    emailId : String,
    password : String,
    name : String
});
const userModel = mongoose.model("users", userSchema);

module.exports = {
    userModel : userModel
}


