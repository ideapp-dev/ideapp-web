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

    res.render('create-exam-editor', {exam:escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, qnum: ''});
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
    exam.questions.push(`//--- question ${currentLength} ---`);

    await exam.save();
    var escapedExam = setObj(exam);

    res.render('create-exam-editor', {exam:escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, language: exam.configs.language});
    
});

router.get('/exam/ans/:id/:q', async (req, res) => {
    const { id, q} = req.params;
    const exam = await Exam.findById(id);
    
    var escapedExam = setObj(exam);

    res.render('create-exam-editor', { exam: escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, 
        language: exam.configs.language, qnum: q});

})

router.post('/exam/:id/:q', async (req, res) =>{
    const { id, q} = req.params;
    const { content } = req.body;

    const exam = await Exam.findById(id);
    exam.questions[q-1] = content;

    await exam.save();
})

//get selected student exam content
router.get('/exam/:examid/:studentid/:q', async (req,res) =>{
    const{examid, studentid, q} = req.params;
    const exam = await Exam.findById(examid);

    const currentStudent = await Student.findById(studentid);

    const exams = currentStudent.exams;
    const currentExam = exams.findIndex(x => x.exam_id == examid);

    var escapedCurrentExam = setObj(exams[currentExam]);
    var escapedExam = setObj(exam);
    var escapedStudent = setObj(currentStudent);

    res.render('asses-exam-editor', { exam: escapedExam, restrictedFuncs: exam.configs.restrictedFuncs, restrictedLibs: exam.configs.restrictedLibs, qnum: q, currentExam: escapedCurrentExam,
    currentStudent: escapedStudent});

})

module.exports = router;