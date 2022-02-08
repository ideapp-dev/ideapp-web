const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstructorSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    sirname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }
}, { collection: 'Instructor' });


module.exports = mongoose.model('Instructor', InstructorSchema);
