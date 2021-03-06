const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const Instructor = require('../models/instructor');
const Lesson = require('../models/lesson');
const { isLoggedIn } = require('../middleware');
const Exam = require('../models/exam');

router.get('/:lectureid/:code', async (req, res) => {
    const{lectureid, code} = req.params;

    //get students for the lecture
    const students = await Student.find( { lessons_taken: lectureid } );
    const names = students.map(x =>  x.name);
    const student_ids = students.map(x => x.student_id);
    const ids = students.map(x => x._id);

    //get exams for the lecture
    const exams = await Exam.find( { lesson_id:lectureid } );
    const exam_names = exams.map(x => x.name);
    const exam_ids = exams.map(x => x._id);

    res.render('instructor-coursepage', {names:names, student_ids:student_ids, ids: ids, exam_names:exam_names, exam_ids:exam_ids, lecture_id:lectureid});
})

module.exports = router;