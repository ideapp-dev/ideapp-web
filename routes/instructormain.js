const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const Instructor = require('../models/instructor');
const Lesson = require('../models/lesson');
const { isLoggedIn } = require('../middleware');
const Exam = require('../models/exam');

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

router.get('/:examid/create-exam', async(req,res) =>{
    const {examid} = req.params;
    const exam = await Exam.findById(examid);

    var escapedExam = setObj(exam);

    res.render('create-exam-editor', {exam:escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs});
})

router.post('/:examid/set-restriction', async(req,res) =>{
    const {examid} = req.params;
    const{type, restricted} = req.body;

    const exam = await Exam.findById(examid);
    
    if(type == 'function')
        exam.configs.restrictedFuncs.push(restricted);
    
    if(type == 'library')
        exam.configs.restrictedLibs.push(restricted);
    
    await exam.save();

    var escapedExam = setObj(exam);
    
    res.render('create-exam-editor', {exam:escapedExam,restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs});
})

router.post('/:examid/set-language', async(req,res) =>{
    const {examid} = req.params;
    const{language} = req.body;

    const exam = await Exam.findById(examid);
    exam.configs.language = language;

    await exam.save();

    var escapedExam = setObj(exam);

    res.render('create-exam-editor', {exam:escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, language: exam.configs.language});
    
})

router.post('/:examid/add-question', async(req,res) =>{
    const {examid} = req.params;
    const exam = await Exam.findById(examid);
    const currentLength = exam.questions.length + 1;
    exam.questions.push(`--- question ${currentLength} ---`);

    await exam.save();

    var escapedExam = setObj(exam);

    res.render('create-exam-editor', {exam:escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, language: exam.configs.language});
    
});

module.exports = router;