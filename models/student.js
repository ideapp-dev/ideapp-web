const { array } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    sirname: {
        type: String,
        required: true
    },

    student_id: {
        type: Number,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    lessons_taken: {
        type: [{ type: Schema.ObjectId, ref: 'Lesson' }]
    }
});


module.exports = mongoose.model('Student', StudentSchema);
