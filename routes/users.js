const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const Instructor = require('../models/instructor');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('../middleware');

router.get('/', async (req, res) => {
    res.render('home', { title: 'home' });
});

router.get('/register', (req, res) => {
    res.render('users/choose', { title: 'register' });
});

router.get('/register/student', (req, res) => {
    res.render('users/register', { userType: 'student' });
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('users/profile', { title: 'profile' });
});

router.post('/register/student', catchAsync(async (req, res, next) => {
    try {
        const { name, sirname, student_id, email, password } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)
        const student = new Student({ name, sirname, student_id, email, password: hashedPassword });
        await student.save();
        req.login(student, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to IdeApp!');
            res.redirect('/');
        })
    } catch (e) {
        console.log("message", e.message);
        req.flash('error', e.message);
        res.redirect('/register/student');
    }
}));

router.get('/register/instructor', async (req, res) => {
    console.log("instructor data:", await Instructor.find({}));
    res.render('users/register', { userType: 'instructor' });
});

router.post('/register/instructor', catchAsync(async (req, res, next) => {
    console.log("instructor posted")
    try {
        const { name, sirname, email, password } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)
        const instructor = new Instructor({ name, sirname, email, password: hashedPassword });
        await instructor.save();
        req.login(instructor, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to IdeApp!');
            res.redirect('/');
        })
    } catch (e) {
        console.log("message", e.message);
        req.flash('error', e.message);
        res.redirect('/register/instructor');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login', { title: 'login' });
});


router.post('/login', passport.authenticate('instructor-auth', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    // const redirectUrl = req.session.returnTo || '/';
    // delete req.session.returnTo;
    res.redirect("/");
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})



module.exports = router;