const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Correct usage of 'type' and 'required'
    age: { type: Number, required: true },
    grade: { type: String, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }] // Reference to the "Course" model
});

module.exports = mongoose.model("Student", studentSchema);
