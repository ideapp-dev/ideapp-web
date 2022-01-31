const mongoose = require('mongoose');

const URI = "mongodb+srv://dbYigit:35183518@projectcluster.oysew.mongodb.net/ideapp?retryWrites=true&w=majority";

const connectDB = async () => {
    await mongoose.connect(URI);
    console.log("Database connected!");
}

module.exports = connectDB;