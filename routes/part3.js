const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

const Part3 = mongoose.model('part3');

// ✅ GET PART 3 PAGE
router.get('/view/:year', ensureAuthenticated, async (req, res) => {
    try {
        const selectedYear = req.params.year;

        const existingData = await Part3.findOne({
            user: req.user.id,
            academicYear: selectedYear
        }).lean();

        res.render('parts/part3', {
            academicYear: selectedYear,

            savedPublications: existingData ? existingData.publications : [],
            savedBooks: existingData ? existingData.books : [],
            savedConferences: existingData ? existingData.conferences : [],
            savedProjects: existingData ? existingData.projects : [],
            savedPatents: existingData ? existingData.patents : []
        });

    } catch (err) {
        console.error(err);
        res.redirect('/users/faculty/facultyOverview');
    }
});


// ✅ SAVE PART 3
router.post('/save', ensureAuthenticated, async (req, res) => {
    try {

        const toArr = (val) => Array.isArray(val) ? val : (val ? [val] : []);

        const {
            pubTitle, pubJournal, pubIssn, pubYear, pubAuthors,
            bookTitle, bookPublisher, bookIsbn, bookYear,
            confTitle, confName, confLocation, confYear,
            projTitle, projAgency, projAmount, projDuration,
            patTitle, patNo, patStatus, patYear,
            academicYear
        } = req.body;

        // 🔵 A. Publications (OPTIONAL)
        const publications = toArr(pubTitle).map((t, i) => ({
            title: t,
            journal: toArr(pubJournal)[i],
            issn: toArr(pubIssn)[i],
            year: toArr(pubYear)[i],
            authors: toArr(pubAuthors)[i]
        })).filter(item => item.title && item.title.trim() !== "");

        // 🔵 B. Books (OPTIONAL)
        const books = toArr(bookTitle).map((t, i) => ({
            title: t,
            publisher: toArr(bookPublisher)[i],
            isbn: toArr(bookIsbn)[i],
            year: toArr(bookYear)[i]
        })).filter(item => item.title && item.title.trim() !== "");

        // 🔵 C. Conferences (OPTIONAL)
        const conferences = toArr(confTitle).map((t, i) => ({
            title: t,
            conferenceName: toArr(confName)[i],
            location: toArr(confLocation)[i],
            year: toArr(confYear)[i]
        })).filter(item => item.title && item.title.trim() !== "");

        // 🔵 D. Projects (OPTIONAL)
        const projects = toArr(projTitle).map((t, i) => ({
            title: t,
            fundingAgency: toArr(projAgency)[i],
            amount: toArr(projAmount)[i],
            duration: toArr(projDuration)[i]
        })).filter(item => item.title && item.title.trim() !== "");

        // 🔵 E. Patents (OPTIONAL)
        const patents = toArr(patTitle).map((t, i) => ({
            title: t,
            patentNo: toArr(patNo)[i],
            status: toArr(patStatus)[i],
            year: toArr(patYear)[i]
        })).filter(item => item.title && item.title.trim() !== "");

        // ✅ SAVE TO DB
        await Part3.findOneAndUpdate(
            {
                user: req.user.id,
                academicYear: academicYear
            },
            {
                user: req.user.id,
                academicYear: academicYear,

                publications,
                books,
                conferences,
                projects,
                patents
            },
            { upsert: true, new: true }
        );

        req.flash('success_msg', 'Part 3 saved successfully!');

        // ✅ SAVE & NEXT → PART 4
        res.redirect(`/part4/view/${academicYear}`);

    } catch (err) {
        console.error("Part3 Save Error:", err);
        req.flash('error_msg', 'Error saving Part 3');
        res.redirect('/users/faculty/facultyOverview');
    }
});

module.exports = router;