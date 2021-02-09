const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const router = express.Router();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const {loginValidation, registerValidation} = require('../Other/validationOfData');
const {verifyToken} = require('../Other/verifyToken');
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginUserController');

router.use(cookieSession({secret: process.env.COOKIE_SECRET_KEY} ));

// Welcome page 
router.get('/', (req, res) =>{
    // res.render('welcome', {layout: 'layout'});
    verifyToken = false;
    if(verifyToken)
        return res.render('/user/getAppointment');
    else 
        return res.redirect('/user/login');
});

router.get('/login', verifyToken, loginController.loginGetController);

// Get register page 
router.get('/register', verifyToken, registerController.registerGetController);

// Post register
router.post('/register', registerController.registerPostController);

// Post login
router.post('/login', loginController.loginPostController);

// Get appointment 
router.get('/getAppointment', verifyToken, (req, res) =>{
    res.render('getAppointment'); 
    
});

module.exports = router;  
 