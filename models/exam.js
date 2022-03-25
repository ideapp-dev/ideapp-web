const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
    lesson_id: {
        type: Schema.ObjectId, ref: 'Lesson',
        required: true
    },

    start_time: {
        type: String
    },

    end_time: {
        type: String
    },

    scores: [{ student_id: String, value: Number }],

    configs: { restrictedFuncs: [{ type: String }], restrictedLibs: [{ type: String }], language: String},

    questions: [{ type: String }]

}, { collection: 'Exam' });


module.exports = mongoose.model('Exam', ExamSchema);
