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
    res.render('users/choose', { to: 'register' });
});

<<<<<<< Updated upstream
=======
router.get('/profile', (req, res) => {
    res.render('users/profile', { title: 'profile' });
});

// /register/student
>>>>>>> Stashed changes
router.get('/register/student', (req, res) => {
    res.render('users/register', { userType: 'student' });
});

<<<<<<< Updated upstream
router.get('/register/instructor', async (req, res) => {
    console.log("instructor data:", await Instructor.find({}));
    res.render('users/register', { userType: 'instructor' });
});

router.get('/login', (req, res) => {
    res.render('users/choose', { to: 'login' });
});

router.get('/login/student', (req, res) => {
    res.render('users/login', { userType: 'student', checkstudent: 'checked', checkinst: 'unchecked' });
});

router.get('/login/instructor', (req, res) => {
    res.render('users/login', { userType: 'instructor', checkstudent: 'unchecked', checkinst: 'checked' });
});

=======
>>>>>>> Stashed changes
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
        req.flash('error', e.message);
        res.redirect('/register/student');
    }
}));

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
        req.flash('error', e.message);
        res.redirect('/register/instructor');
    }
}));

router.post('/login/student', passport.authenticate('student-auth', { failureFlash: true, failureRedirect: '/login/student' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    // const redirectUrl = req.session.returnTo || '/';
    // delete req.session.returnTo;
    res.redirect("/");
})

router.post('/login/instructor', passport.authenticate('instructor-auth', { failureFlash: true, failureRedirect: '/login/instructor' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    // const redirectUrl = req.session.returnTo || '/';
    // delete req.session.returnTo;
    res.redirect("/");
})

router.get('/profile', isLoggedIn, (req, res) => {
    let fullname = req.user[0].name + " " + req.user[0].sirname;
    res.render('users/profile', { user: req.user, fullname: fullname });
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})



module.exports = router;