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
        const studentInputs = {
            name: 'Yigit2',
            sirname: 'Karaduman2',
            student_id: '1611010642',
            email: 'ykaraduman@etu.edu.tr2',
            username: 'ykaraduman2'
        };

        const student = new Student(studentInputs);
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