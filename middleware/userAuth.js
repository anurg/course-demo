const jwt = require("jsonwebtoken");

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

function userAuth(req,res,next) {
    if (!req.body.id) {
        res.json({
         message :   "Not Authenticated!"
        });
    } else {
        next();
    }
}

module.exports = {
    userAuth : userAuth
}