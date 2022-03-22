const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const Instructor = require('../models/instructor');
const Lesson = require('../models/lesson');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, async (req, res) => {
    const lectures = await Lesson.find({ instructor: req.user[0]._id });
    res.render('users/instructor', { lectures: lectures })
})

router.post('/lecture', isLoggedIn, async (req, res) => {
    const { code, name, description, credit } = req.body;
    const currentInstructor = req.user[0];
    const newLecture = new Lesson({ code, name, description, credit, faculty: 'Computer Engineering', instructor: currentInstructor._id, semester: 'Spring 2022' });
    await newLecture.save();

    currentInstructor.lessons_given.push(newLecture);
    await currentInstructor.save();

    res.redirect('/instructor-main');
})


module.exports = router;