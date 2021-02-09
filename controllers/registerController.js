const mongoose = require('mongoose');
const User = mongoose.model('User');

const {registerValidation, loginValidation} = require('../Other/validationOfData');
const bcrypt = require('bcryptjs');

module.exports.registerPostController = async (req, res) =>{
    
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


module.exports.registerGetController = (req, res) =>{ 
    console.log('this is req.id', req.id);
    if(req.id == 'loggedout')
        res.render('registerPage', {Title: 'Register', role:'user'});
    else 
        res.redirect('/user/getAppointment');
};