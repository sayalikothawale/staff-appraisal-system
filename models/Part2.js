const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Part2Schema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    academicYear: { type: String, required: true },

    // 🔵 A. FDP (Faculty Development Program)
    fdp: [
        {
            title: String,
            organizedBy: String,
            fromDate: String,
            toDate: String,
            durationWeeks: String
        }
    ],

    // 🔵 B. MOOC Courses (NPTEL / AICTE)
    mooc: [
        {
            courseTitle: String,
            fromDate: String,
            toDate: String,
            durationWeeks: String
        }
    ],

    // 🔵 C. Industrial / Professional Training
    training: [
        {
            instituteName: String,
            fromDate: String,
            toDate: String,
            durationWeeks: String
        }
    ],

    date: { type: Date, default: Date.now }

});

module.exports = mongoose.model('part2', Part2Schema);