const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    code: {
        type: String,
        unique: true
    },

    description: {
        type: String,
        unique: true
    },

    credit: {
        type: Number,
        required: true
    },

    faculty: {
        type: String,
        unique: true
    },

    semester: {
        type: String,
        required: true
    },

    instructor: {
        type: String,
        required: true
    },

    time: {
        type: Object,
        required: true
    }

}, { collection: 'Lesson' });


module.exports = mongoose.model('Lesson', LessonSchema);
