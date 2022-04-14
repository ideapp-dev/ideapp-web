const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./connection.js');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const cors = require("cors");

//--- db
const Student = require('./models/student');
const Instructor = require('./models/instructor');
//---

const userRoutes = require('./routes/users');
const aceRoutes = require('./routes/editor');
const studentRoutes = require('./routes/studentmain');
const instructorRoutes = require('./routes/instructormain');
const instructorCourseRoutes = require('./routes/instructor-course');
const studentCourseRoutes = require('./routes/student-course');

connectDB();

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('tiny'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

//--- passport setup
const initializePassport = require('./passport-config');
initializePassport.initializeStudent(
    passport,
    email => Student.find({ email: email }),
    id => Student.find({ _id: id })
);

initializePassport.initializeInstructor(
    passport,
    email => Instructor.find({ email: email }),
    id => Instructor.find({ _id: id })
);

app.use(passport.initialize());
app.use(passport.session())

app.use((req, res, next) => {
    console.log("current user:", req.user);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/playground', aceRoutes);
app.use('/student-main', studentRoutes);
app.use('/instructor-main', instructorRoutes);
app.use('/instructor-main/course', instructorCourseRoutes);
app.use('/student-main/course', studentCourseRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})