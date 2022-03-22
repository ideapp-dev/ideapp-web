const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const Lesson = require('../models/lesson');
const Exam = require('../models/exam');
const { isLoggedIn } = require('../middleware');


router.get('/', isLoggedIn, async (req, res) => {
    let currentStudent = await Student.findById(req.user[0]._id);

    let studentPopulated = await currentStudent.populate("lessons_taken");
    let enrolledLessons = studentPopulated.lessons_taken;

    let lectures = await Lesson.find({});
    let lectureCodes = [];
    lectures.forEach(lecture => lectureCodes.push(lecture.code));

    res.render('users/student', { lectureCodes: lectureCodes, enrolledLessons: enrolledLessons });
})

router.post('/enroll', isLoggedIn, async (req, res) => {
    const { code } = req.body;
    let newLecture = await Lesson.findOne({ code: code });

    let currentStudent = await Student.findById(req.user[0]._id);
    currentStudent.lessons_taken.push(newLecture);
    await currentStudent.save();

    res.redirect('/student-main');
})

router.get('/exam/:id', async (req, res) => {
    const { id } = req.params;
    const exam = await Exam.findById(id);
    let stringified =  JSON.stringify(exam);
    var escaped = stringified.replace(/[\\]/g, '\\\\')
                                .replace(/[\"]/g, '\\\"')
                                .replace(/[\/]/g, '\\/')
                                .replace(/[\b]/g, '\\b')
                                .replace(/[\f]/g, '\\f')
                                .replace(/[\n]/g, '\\n')
                                .replace(/[\r]/g, '\\r')
                                .replace(/[\t]/g, '\\t');


    res.render('exam-editor', { exam: escaped, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs });
})


module.exports = router;