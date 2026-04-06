const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Part3Schema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    academicYear: { type: String, required: true },

    // 🔵 A. Research Publications
    publications: [
        {
            title: String,
            journal: String,
            issn: String,
            year: String,
            authors: String
        }
    ],

    // 🔵 B. Books / Chapters
    books: [
        {
            title: String,
            publisher: String,
            isbn: String,
            year: String
        }
    ],

    // 🔵 C. Conferences / Papers
    conferences: [
        {
            title: String,
            conferenceName: String,
            location: String,
            year: String
        }
    ],

    // 🔵 D. Projects / Consultancy
    projects: [
        {
            title: String,
            fundingAgency: String,
            amount: String,
            duration: String
        }
    ],

    // 🔵 E. Patents / IPR
    patents: [
        {
            title: String,
            patentNo: String,
            status: String, // Filed / Published / Granted
            year: String
        }
    ],

    date: { type: Date, default: Date.now }

});

module.exports = mongoose.model('part3', Part3Schema);