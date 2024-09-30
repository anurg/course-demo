const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_DB_URL);

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


