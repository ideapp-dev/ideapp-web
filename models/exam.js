const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
    lesson_id: {
        type: Schema.ObjectId, ref: 'Lesson',
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    total_time: {
        type: String,
        required: true,
    },

    scores: [{ student_id: String, value: Number }],

    configs: { restrictedFuncs: [{ type: String }], restrictedLibs: [{ type: String }], language: String},

    questions: [{ type: String }]

}, { collection: 'Exam' });


module.exports = mongoose.model('Exam', ExamSchema);
