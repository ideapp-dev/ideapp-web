const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');


// /register
router.get('/', (req, res) => {
    res.send('choose user type');
});

// /register/student
router.get('/student', (req, res) => {
    res.render('users/register_student', { title: 'register' });
});

router.post('/student', catchAsync(async (req, res, next) => {
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

// /register/instructor
router.get('/instructor', (req, res) => {
    res.send('instructor registiration page');
});

module.exports = router;