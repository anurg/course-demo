const express = require("express");
const adminRouter = express.Router();

adminRouter.post("/login",function(req,res) {
    res.json({
        message:"Request Successful."
    })
});
adminRouter.post("/signup",function(req,res) {
    res.json({
        message:"Request Successful."
    })
});

module.exports = {
    adminRouter : adminRouter
}
