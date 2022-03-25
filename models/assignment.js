const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
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

    scores: [{ student_id: String, value: Number }]

}, { collection: 'Assignment' });


module.exports = mongoose.model('Assignment', AssignmentSchema);
