const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const router = express.Router();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Appointment = mongoose.model('Appointment');
const {loginValidation, registerValidation} = require('../Other/validationOfData');
const {verifyToken} = require('../Other/verifyToken');
const userController = require('../controllers/userController');

router.use(cookieSession({secret: process.env.COOKIE_SECRET_KEY} )); 

// Welcome page 
router.get('/',verifyToken, (req, res) =>{
    // res.render('welcome', {layout: 'layout'});
        return res.redirect('/user/home');
});

router.get('/login', userController.loginGet);

// Get register page 
router.get('/register', userController.registerGet);

// Post register
router.post('/register', userController.registerPost);

// Post login
router.post('/login', userController.loginPost);

// getAppointment 
router.get('/getAppointment', verifyToken , async (req, res) =>{
    try{ 
        // if user token is not valid req.id is loggedout // protected route
        if(req.id == 'loggedout'){
            return res.redirect('/user/login');
        } 
        var admins = await Admin.find({}).select(' -name -email -password ') ; 
        res.render('getAppointment', {Title: 'Get appointment', admins: admins, method: 'GET'}); 
    }catch(e){
        console.log(e); 
        return res.send('Sorry, there seems to be error in system. Plz try again after some time.')
    } 
});

router.post('/getAppointment',verifyToken, async (req, res) => {
    if(req.id == 'loggedout'){
        return res.redirect('/login');
    }
    try{
        console.log(req.body);
        const state = req.body.inputState;
        const district = req.body.inputDistrict;
        const taluka = req.body.inputTaluka;
        var landmark = req.body.inputLandmark;
        landmark = landmark.replace('$', ' '); // this is bcoz value attr. in html doesn't allow spaces

        const admins = await Admin.find({
            'address.state': state, 
            'address.district':district, 
            'address.taluka':taluka, 
            'address.landmark':landmark,  
        }).select('-password');
        console.log(admins);
        return res.render('getAppointment', {Title: 'Get appointment', admins: admins, method:'POST'});
    }
    catch(e){ 
        console.log(e); 
        return res.send('Error is system plz try again'); 
    }
});

router.get('/getAppointment/:id', async (req, res) => {
    try{
        var start_time = await Admin.find({_id: req.params.id}).select('start_time -_id');
        var closing_time = await Admin.find({_id: req.params.id}).select('closing_time -_id');
        var interval_time = await Admin.find({_id: req.params.id}).select('interval_time -_id ');

        start_time = JSON.stringify(start_time[0].start_time);
        start_time = parseInt(start_time);

        closing_time = JSON.stringify(closing_time[0].closing_time);
        closing_time = parseInt(closing_time);

        interval_time = JSON.stringify(interval_time[0].interval_time);
        interval_time = parseInt(interval_time);


        const used_intervals = await Appointment.find({admin_id: req.params.id}).select('start_time -_id');

        console.log(used_intervals);

        var used_intervals_set = new Set();

        used_intervals.forEach((used_interval) => {
            // console.log(used_interval.start_time);
            used_intervals_set.add(parseInt(used_interval.start_time));
        });
        for(var i in used_intervals){
            console.log(i);
        }

        console.log(used_intervals_set);

        res.render('appointments', { used_intervals: used_intervals, Title: 'Get Appointment', role: 'user', admin_id: req.params.id, 
            start_time: start_time,
            closing_time: closing_time,
            interval_time: interval_time,
            used_intervals_set: used_intervals_set, 

        });
    }catch(e){
        console.log(e);
        res.send('Error in system plz try again after some time.');
    }
});

router.get('/getAppointment/:id/:hh/:mm', verifyToken, (req, res) => {
    
    res.render('confirm', {Title: 'Confirm', admin_id: req.params.id, hh: req.params.hh, mm: req.params.mm,
    confirmed: false
    } );
});

// Confirmed appointment
router.get('/getAppointment/:id/:hh/:mm/confirm', verifyToken, async (req, res) => {
    try{
        console.log(req.id);
        const appointment = new Appointment;
        appointment.user_id = req.id;
        appointment.admin_id = req.params.id;
        appointment.start_time = parseInt(req.params.hh)*60 + parseInt(req.params.mm);
        
        const admin = await Admin.findOne({_id: req.params.id});
        appointment.end_time = parseInt(appointment.start_time)+ parseInt(admin.interval_time);

        const saved_appointment = await appointment.save();
        res.render('confirm', {Title: 'Confirmed appointment', admin_id: req.params.id, hh: req.params.hh, mm: req.params.mm,
        confirmed: true} );
    }catch(e){
        console.log(e);
        res.send('Error in system plz try again after some time.');
    }
});

router.get('/home', verifyToken, (req, res) =>{
    res.render('userHomePage', {Title: 'Home', role:'user'});
});


module.exports = router;  
 