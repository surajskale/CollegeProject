const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const router = express.Router();
const mongoose = require('mongoose');
const joi = require('joi');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const {loginValidation, registerValidation} = require('../Other/validationOfData');
const {verifyToken} = require('../Other/verifyToken');

router.use(cookieSession({secret: process.env.COOKIE_SECRET_KEY} ));
// Welcome page 
router.get('/', (req, res) =>{
    // res.render('welcome', {layout: 'layout'});
    verifyToken = false;
    if(verifyToken)
        return res.render('getAppointment');
    else 
        return res.redirect('/user/login');
});

router.get('/login', (req, res) =>{
    if(req.jwt_failed == true){
        console.log('This is get/login and jwt failed');
        return render('loginPage', {Title: 'Login failed', role: 'user', message:'It seems your session expired.'});
    }
    res.render('loginPage', {Title: 'Login', role:'user'});
});

router.get('/register', (req, res) =>{ 
    res.render('registerPage', {Title: 'Register', role:'user'});
});

router.post('/register',  async (req, res) =>{
    
    const dataToValidate = {
        Name: req.body.inputName, 
        Email: req.body.inputEmail,
        Password: req.body.inputPassword
    }
    const result = registerValidation(dataToValidate);
    // const {error} = registerValidation(dataToValidate); // instead of above line we can use this 
    if(result.error){
        return res.render('registerPage', {Title: 'Register', role: 'user', message: result.error.details[0].message});
    } 

    const user = await User.findOne({email: req.body.inputEmail});
    if(user){
        return res.render('registerPage', {Title: 'Register', role: 'user', message: 'This email is already registered.'});
    }
    // Hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.inputPassword, salt);

    // Create new user 
    const newUser = new User;
    newUser.name= req.body.inputName;
    newUser.email= req.body.inputEmail;
    newUser.password= hashedPassword;

    // newUser.save().then(()=> console.log('User saved')).catch((e) => {
    //     console.log('Error while saving new user.');
    //     return res.send('Error saving ');
    // });
    
    // Saving new user 
    try{
        await newUser.save();
    }catch(err){
        console.log('Error while saving new user ' + err);
        return res.render('registerPage', {Title: 'Register', role: 'user', message: 'Error in system plz try again in some time.'});
    }

    res.redirect('/user/login');
});

// Global auth token 
var globalAuthToken = "";

// Post login
router.post('/login',  async (req, res) =>{
    console.log('Test 1');
    const dataToValidate = {
        Email: req.body.inputEmail,
        Password: req.body.inputPassword
    }
    const result = loginValidation(dataToValidate);
    // const {error} = registerValidation(dataToValidate); // instead of above line we can use this 
    if(result.error){
        return res.render('loginPage', {Title: 'Login', role: 'user', message: result.error.details[0].message});
    } 

    const user = await User.findOne({ email: req.body.inputEmail});
    if(!user){
        console.log('user not found');
        return res.render('loginPage', {Title: 'Login', role: 'user', message: 'Email or password is incorrect'});
    } 
    console.log('Test 12');
 
    const valid_user = await bcrypt.compare( req.body.inputPassword, user.password);
    if(!valid_user){
        return res.render('loginPage', {Title: 'Login', role: 'user', message: 'Email or password is incorrect.'});
    }   
    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
    // res.header('authToken', token).redirect( '/user/getAppointment');
    // res.render('getAppointment', {authToken: token});
    // res.redirect('/user/getAppointment');
    // res.json({'authToken': token});
    // return res.render('loginPage', {Title: 'Login', role: 'user', isLogged: true, authToken: token});
    req.session.token = token;
    console.log('Test 3');
    res.redirect('/user/getAppointment');
});

// Get appointment 
router.get('/getAppointment', verifyToken, (req, res) =>{
    console.log(req.session.token);
    res.render('getAppointment'); 
    
});
module.exports = router;  
 