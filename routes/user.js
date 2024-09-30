const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const { userModel } = require( "../db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

// Not Authenticated route
userRouter.post("/signup", async function(req,res) {
    const emailId = req.body.emailId;
    const password = req.body.password;
    const name = req.body.name;
    const hashedPassword = await bcrypt.hash(password,5);
    try {
        await userModel.create({
            emailId : emailId,
            password : hashedPassword,
            name : name
        });
        res.json({
            message:"Signup Successful."
        });
    } catch(e) {
        res.status(403).json({
            message : e.message
        })
    }
    
});

// Authenticated routes
userRouter.post("/login", async function(req,res) {
    const emailId = req.body.emailId;
    const password = req.body.password;
    const user = await userModel.findOne({emailId : emailId});
    console.log(user)
    const passwordMatch = await bcrypt.compare(password,user.password);
    if (passwordMatch) {
        const token = jwt.sign({emailId : emailId}, USER_JWT_SECRET);
        res.json({
            token : token
        });
    } else {
        res.json({
            message:"Invalid Credentials!"
        });
    }
    
});
userRouter.get("/courses",userAuth,function(req,res) {
    res.json({
        message:"Request Successful."
    })
});

module.exports = {
    userRouter : userRouter
}