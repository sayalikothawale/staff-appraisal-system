const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Part2Schema = new Schema({
<<<<<<< HEAD

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
=======
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    academicYear: { type: String, required: true },
    // Array of research objects
    researchEntries: [{
        category: { type: String }, // e.g., Journal, Conference, Book
        title: { type: String, required: true },
        journalName: { type: String },
        impactFactor: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        enclosure: { type: String }
    }],
    date: { type: Date, default: Date.now }
});

mongoose.model('part2', Part2Schema);
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
