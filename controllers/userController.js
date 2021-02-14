const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const {loginValidation, registerValidation} = require('../Other/validationOfData');

module.exports.loginPost = async (req, res) =>{
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
 
    const valid_user = await bcrypt.compare( req.body.inputPassword, user.password);
    if(!valid_user){
        return res.render('loginPage', {Title: 'Login', role: 'user', message: 'Email or password is incorrect.'});
    }   
    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
    
    req.session.token = token;
    res.redirect('/user/getAppointment');
};

module.exports.loginGet = (req, res) =>{
    console.log(req.session.token);

    if(req.session.token != undefined ){ // is there is token
        if(req.id == 'loggedout')
            res.render('loginPage', {Title: 'Login', role:'user'});
        else 
            res.redirect('/user/home');
    } 
    else{// if there is no token i.e. first time visit
        res.render('loginPage', {Title: 'Login', role:'user'}); 
    } 
};

module.exports.registerPost = async (req, res) =>{
    
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
};


module.exports.registerGet = (req, res) =>{ 
    console.log('this is req.id', req.id);
    if(req.session.token != undefined){
        if(req.id == 'loggedout')
            res.render('registerPage', {Title: 'Register', role:'user'});
        else 
            res.redirect('/user/getAppointment');
    }
    else{
        res.render('registerPage', {Title: 'Register', role:'user'});
    }
};