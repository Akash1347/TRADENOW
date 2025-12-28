const express = require("express");
const {signin, login, sendVerificationCode, verifyAccount, forgotPassword, resetPassword, logout, isAuthenticated, getUserData, addwatchlist, removewatchlist, sendWatchlist}  = require("../controllers/userAuth");
const { userAuth } = require("../middleware/userAuth");

const route = express.Router();

route.post('/signin' ,signin);
route.post('/login' ,login);
route.post('/logout' ,logout);
route.post('/sendverificationotp' ,userAuth ,sendVerificationCode);
route.post('/verifyaccount' ,userAuth ,verifyAccount);
route.post('/forgotpassword' ,forgotPassword);
route.post('/resetpassword' ,resetPassword);
route.post('/authenticate' ,userAuth ,isAuthenticated);
route.get("/me", userAuth, getUserData);


module.exports = route;
