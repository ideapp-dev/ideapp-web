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

    //get exams for the lecture
    const exams = await Exam.find( { lesson_id:lectureid } );
    const exam_names = exams.map(x => x.name);
    const exam_ids = exams.map(x => x._id);

    //get exam scores for the student
    const currentStudent = await Student.findById(req.user[0]._id);
    let studentExams = currentStudent.exams;
    const totalScores = [];
    for(let i = 0; i < exams.length; i++){
        const currentExamIndex = studentExams.findIndex(x => x.exam_id == exams[i].id);
        console.log("currentExamIndex");
        if(currentExamIndex != -1){
            let total = 0;
            for(let k = 0; k < studentExams[currentExamIndex].score.length; k++){ //get total scores for the exams.
                const score = studentExams[i].score[k];
                if(score != null && score != undefined)
                    total = total + parseInt(score);
            }

            totalScores[currentExamIndex] = total;
        }

    }

    res.render('student-coursepage', {names:names, student_ids:student_ids, exam_names:exam_names, exam_ids:exam_ids, lecture_id:lectureid, totalScores:totalScores})
})

module.exports = router;