const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('../middleware');

router.get('/', async (req, res) => {
    res.render('home', { title: 'home' });
});

router.get('/register', (req, res) => {
    res.render('users/choose', { title: 'register' });
});

router.get('/register/student', (req, res) => {
    res.render('users/register_student', { title: 'register' });
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

router.get('/register/instructor', (req, res) => {
    res.render('users/register_instructor', { title: 'register' });
});

router.get('/login', (req, res) => {
    res.render('users/login', { title: 'login' });
});


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
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