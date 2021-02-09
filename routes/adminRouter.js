const express = require('express');
const router = express.Router();
router.use(express.urlencoded({extended: false}));

router.get('/appointments', (req, res) => {
    mes = [];
    mes.push('asfdjskalf');
    mes.push('asfdjskalf');
    mes.push('asfdjskalf');
    res.render('appointments', {mes});
});

router.get('/login', (req, res) =>{
    res.render('loginPage', {Title: 'Login', role:'admin'});
});

router.get('/register', (req, res) =>{
    res.render('registerPage', {Title: 'Register', role:'admin'});
});

router.post('/register', (req, res) =>{
    
})
module.exports = router;


