const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const { userModel } = require( "../db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const session = require("express-session");
require("dotenv").config();

// const app = express();
// userRouter.set('view engine', 'ejs');

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

// Session middleware
// userRouter.use(
//     session({
//       secret: 'mysecret',
//       resave: false,
//       saveUninitialized: true,
//     })
//   );
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
        res.render("signup",{
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
    try {
        const emailId = req.body.emailId;
        const password = req.body.password;
        console.log(req.body);
        const user = await userModel.findOne({emailId : emailId});
        
        const passwordMatch = await bcrypt.compare(password,user.password);
        if (passwordMatch) {
            const token = jwt.sign({emailId : emailId}, USER_JWT_SECRET);
            // res.json({
            //     token : token,
            //     user : user
            // });
             req.user = user;
            //  res.redirect("/api/v1/user/courses");
            res.render("user", { user: req.user });
        } else {
            res.json({
                message:"Invalid Credentials!"
            });
        }
    } catch(e) {
        res.json({
            message : e.message
        })
    }
 
});

// userRouter.post("/login", async function(req, res) {
//     try {
//         const { emailId, password } = req.body;
//         console.log("Login attempt for:", emailId);

//         if (!emailId || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         const user = await userModel.findOne({ emailId: emailId });
//         console.log("User found:", user ? "Yes" : "No");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         console.log("Password match:", passwordMatch);

//         if (passwordMatch) {
//             const token = jwt.sign({ emailId: emailId }, USER_JWT_SECRET);
//             req.user = user;
//             // res.redirect("/api/v1/user/courses");
//             res.render("user", { user: req.user });
//         } else {
//             res.status(401).json({ message: "Invalid credentials" });
//         }
//     } catch (e) {
//         console.error("Login error:", e);
//         res.status(500).json({ message: "An error occurred during login", error: e.message });
//     }
// });




userRouter.get("/courses",function(req,res) {
    res.json({
        message:"Courses Request Successful."
    })
});

module.exports = {
    userRouter : userRouter
}