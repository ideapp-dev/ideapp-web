const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');


// /register
router.get('/', (req, res) => {
    res.render('home', { title: 'home' });
});

router.get('/register', (req, res) => {
    res.render('users/choose', { title: 'register' });
});

// /register/student
router.get('/register/student', (req, res) => {
    res.render('users/register_student', { title: 'register' });
});

router.post('/register/student', catchAsync(async (req, res, next) => {
    try {
        const { name, sirname, student_id, email } = req.body;
        console.log("email", email);
        username = email.substring(0, email.lastIndexOf("@"));
        const student = new Student({ name, sirname, student_id, email, username });
        const registeredStudent = await Student.register(student, 'asdasd');
        //req.flash('success', 'Welcome to IdeApp!');
        res.send('success, you are registered!');
    } catch (e) {
        //req.flash('error', e.message);
        res.send(e.message);
    }
}));

router.get('/register/instructor', (req, res) => {
    res.render('users/register_instructor', { title: 'register' });
});

// /register/instructor
router.get('/login', (req, res) => {
    res.render('users/login', { title: 'login' });
});



module.exports = router;