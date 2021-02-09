const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const {loginValidation, registerValidation} = require('../Other/validationOfData');
const { verifyToken } = require('../Other/verifyToken');

module.exports.loginPostController = async (req, res) =>{
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
    // res.header('authToken', token).redirect( '/user/getAppointment');
    // res.render('getAppointment', {authToken: token});
    // res.redirect('/user/getAppointment');
    // res.json({'authToken': token});
    // return res.render('loginPage', {Title: 'Login', role: 'user', isLogged: true, authToken: token});
    req.session.token = token;
    res.redirect('/user/getAppointment');

};

module.exports.loginGetController = (req, res) =>{
    if(req.id == 'loggedout')
        res.render('loginPage', {Title: 'Login', role:'user', message: 'You are logged out.'});
    else 
        res.redirect('/user/getAppointment');
};
