const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = mongoose.model('Admin');
const { loginValidation, registerValidationAdmin} = require('../Other/validationOfData');


module.exports.loginPost = async (req, res) =>{
    if(req.id == 'loggedout'){
        return res.redirect('/admin/login/');
    }
    const dataToValidate = {
        Email: req.body.inputEmail,
        Password: req.body.inputPassword
    }
    const result = loginValidation(dataToValidate);
    // const {error} = registerValidation(dataToValidate); // instead of above line we can use this 
    if(result.error){
        return res.render('loginPage', {Title: 'Login', role: 'admin', message: result.error.details[0].message});
    } 

    const admin = await Admin.findOne({ email: req.body.inputEmail});
    if(!admin){ 
        console.log('user not found');
        return res.render('loginPage', {Title: 'Login', role: 'admin', message: 'Please provide a valid username and password.'});
    } 
 
    const valid_admin= await bcrypt.compare( req.body.inputPassword, admin.password);
    if(!valid_admin){
        return res.render('loginPage', {Title: 'Login', role: 'admin', message: 'Please provide a valid username and password.'});
    }   
    const token = await jwt.sign({id: admin._id}, process.env.JWT_SECRET_KEY);
    req.session.admin_token = token;
    res.redirect('/admin/appointments');

};

module.exports.loginGet = (req, res) =>{
    console.log(req.id);
    if(req.id == 'loggedout')
        res.render('loginPage', {Title: 'Login', role:'admin'});
    else 
        res.redirect('/admin/appointments');
}; 

module.exports.registerPost = async (req, res) =>{
    console.log(req.body);
    try{
        
        const dataToValidate = {
            Name: req.body.inputName, 
            Email: req.body.inputEmail,
            Password: req.body.inputPassword , 
            State: req.body.inputState,
            District: req.body.inputDistrict,
            Taluka: req.body.inputTaluka,
            Landmark: req.body.inputLandmark
        }
        const result = registerValidationAdmin(dataToValidate);
        // const {error} = registerValidation(dataToValidate); // instead of above line we can use this 
        if(result.error){
            return res.render('registerPage', {Title: 'Register', role: 'admin', message: result.error.details[0].message});
        } 
        const admin = await Admin.findOne({email: req.body.inputEmail});
        if(admin){
            return res.render('registerPage', {Title: 'Register', role: 'admin', message: 'This email is already registered.'});
        }
        // Hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.inputPassword, salt);

        // Create new user 
        const newAdmin = new Admin;
        newAdmin.name= req.body.inputName;
        newAdmin.email= req.body.inputEmail;
        newAdmin.password= hashedPassword;
        newAdmin.address.state= req.body.inputState;
        newAdmin.address.district= req.body.inputDistrict;
        newAdmin.address.taluka = req.body.inputTaluka;
        newAdmin.address.landmark = req.body.inputLandmark;

        const s = req.body.inputStartTime.split(':');
        console.log(typeof(s[0]));
        console.log(s); 
        newAdmin.start_time = parseInt(s[0]*60) + parseInt(s[1]); // Total no. of minutes
        const c = req.body.inputClosingTime.split(':');
        newAdmin.closing_time = parseInt(c[0]*60) + parseInt(c[1]); 
        newAdmin.interval_time = parseInt(req.body.inputIntervalTime);

        // Saving new user 
        const savedAdmin = await newAdmin.save();
        console.log(savedAdmin);
    }catch(err){
        console.log('Error while saving new user ' + err);
        // return res.render('registerPage', {Title: 'Register', role: 'admin', message: 'Error in system plz try again in some time.'});
        return res.send('Error in system plz try again.');
    }

    res.redirect('/admin/login');
}; 

module.exports.registerGet = (req, res) =>{ 
    console.log('This is req.id', req.id);
    if(req.id == 'loggedout')
        res.render('registerPage', {Title: 'Register', role:'user'});
    else 
        res.redirect('/admin/appointments');
}; 
