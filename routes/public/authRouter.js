const express = require('express')
const authController = require('../../controllers/auth.controller')
const passport = require('passport');

const authRouter = express.Router()

authRouter.post('/register', authController.signUp);
authRouter.post('/login', authController.login);
authRouter.get('/google', authController.googleLogin);
authRouter.get('/google/callback', authController.googleCallback, authController.handleGoogleSuccess);
authRouter.get('/facebook', authController.facebookLogin); 
authRouter.get('/facebook/callback', authController.facebookCallback, authController.handleFacebookSuccess); 


module.exports = authRouter