const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const Lesson = require('../models/lesson');
const Exam = require('../models/exam');
const { isLoggedIn, isExamTimeOn, isExamTimeEnd } = require('../middleware');

const setObj = function(obj){
    let stringified =  JSON.stringify(obj);
    var escaped = stringified.replace(/[\\]/g, '\\\\')
                            .replace(/[\"]/g, '\\\"')
                            .replace(/[\/]/g, '\\/')
                            .replace(/[\b]/g, '\\b')
                            .replace(/[\f]/g, '\\f')
                            .replace(/[\n]/g, '\\n')
                            .replace(/[\r]/g, '\\r')
                            .replace(/[\t]/g, '\\t');
    return escaped;
}


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

//see exam
router.get('/exam/:id', async(req,res) =>{
    const { id, q } = req.params;
    const exam = await Exam.findById(id);

    if(isExamTimeEnd(exam))
        res.send("exam is ended!");

    if(isExamTimeOn(exam)){
        const currentUser = await Student.findById(req.user[0]._id);

        const exams = currentUser.exams;
        const currentExam = exams.findIndex(x => x.exam_id == id);

        var escapedCurrentExam = '';
        var escapedExam = '';

        if(currentExam >= 0){ //if it exists
            currentUser.exams[currentExam].answers = exam.questions;
            await currentUser.save();

            escapedCurrentExam = setObj(exams[currentExam]);
            escapedExam = setObj(exam);
        }
        else{
            const newExam = {
                exam_id: id,
                answers: exam.questions,
                score: []
            };
            
            currentUser.exams.push(newExam);
            await currentUser.save();

            escapedCurrentExam = setObj(newExam);
            escapedExam = setObj(exam);
        } 

        res.render('exam-editor', { exam: escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, qnum: q, currentExam: escapedCurrentExam});
    }
    else
        res.send("exam is not started yet!");

})

router.get('/exam/:id/:q', async (req, res) => {
    const { id, q} = req.params;
    const exam = await Exam.findById(id);

    if(isExamTimeOn(exam)){
        var escaped = setObj(exam);
        res.render('exam-editor', { exam: escaped, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, qnum: q});
    }
    else
        res.send("exam is not started yet!");
})

//get the specified question content
router.get('/exam/ans/:id/:q', async (req, res) => {
    const { id, q} = req.params;
    const exam = await Exam.findById(id);
    
    if(isExamTimeOn(exam)){
        const currentUser = await Student.findById(req.user[0]._id);

        const exams = currentUser.exams;
        const currentExam = exams.findIndex(x => x.exam_id == id);
    
        var escapedCurrentExam = setObj(exams[currentExam]);
        var escapedExam = setObj(exam);

        res.render('exam-editor', { exam: escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, qnum: q, currentExam: escapedCurrentExam});
    }
    else
        res.send("exam is not started yet!");
})

//save the answer of the current question
router.post('/exam/:id/:q', async (req, res) =>{
    const { id, q} = req.params;
    const { answer } = req.body;

    const currentUser = await Student.findById(req.user[0]._id);
    
    const exams = currentUser.exams;
    const currentExam = exams.findIndex(x => x.exam_id == id);

    currentUser.exams[currentExam].answers[q-1] = answer;
    
    await currentUser.save();

    res.send("asdsad");
})


module.exports = router;