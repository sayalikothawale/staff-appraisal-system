const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

const Part4 = mongoose.model('part4');

<<<<<<< HEAD

// ✅ GET PART 4 PAGE
router.get('/view/:year', ensureAuthenticated, async (req, res) => {
    try {
        const selectedYear = req.params.year;

        const existingData = await Part4.findOne({
            user: req.user.id,
            academicYear: selectedYear
=======
// GET Route
router.get('/view/:year', ensureAuthenticated, async (req, res) => {
    try {
        const selectedYear = req.params.year;
        const existingData = await Part4.findOne({ 
            user: req.user.id, 
            academicYear: selectedYear 
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
        }).lean();

        res.render('parts/part4', {
            academicYear: selectedYear,
<<<<<<< HEAD
            savedAdmin: existingData ? existingData.adminEntries : [],
            declaration: existingData ? existingData.declaration : {}
        });

    } catch (err) {
        res.redirect('/summary');
    }
});


// ✅ SAVE + FINAL SUBMIT
router.post('/save', ensureAuthenticated, async (req, res) => {
    try {
        let { role, level, enclosure, academicYear,
              agreed, place, signature } = req.body;

        const toArr = (val) => Array.isArray(val) ? val : [val];

        // ✅ Admin Entries (Optional)
        const adminData = toArr(role).map((r, i) => ({
            role: r,
            level: toArr(level)[i],
            enclosure: toArr(enclosure)[i]
        })).filter(item => item.role && item.role.trim() !== "");

        // ✅ Declaration
        const declarationData = {
            agreed: agreed === 'on', // checkbox
            place: place,
            date: new Date(),
            signature: signature
        };

        // ✅ Final Submit Condition
        const isSubmitted = declarationData.agreed && signature;

        await Part4.findOneAndUpdate(
            { user: req.user.id, academicYear: academicYear },
            {
                user: req.user.id,
                academicYear: academicYear,
                adminEntries: adminData,
                declaration: declarationData,
                isSubmitted: isSubmitted
            },
            { upsert: true, new: true }
        );

        req.flash('success_msg', isSubmitted 
            ? 'Form Submitted Successfully!' 
            : 'Part 4 Saved (Not Submitted)'
        );

        res.redirect('/summary');

    } catch (err) {
        console.error(err);
        res.redirect('/summary');
=======
            savedAdmin: existingData ? existingData.adminEntries : []
        });
    } catch (err) {
        res.redirect('/users/faculty/facultyOverview');
    }
});

// POST Route
router.post('/save', ensureAuthenticated, async (req, res) => {
    try {
        let { role, level, points, enclosure, academicYear } = req.body;
        const toArr = (val) => Array.isArray(val) ? val : [val];

        const adminData = toArr(role).map((r, i) => ({
            role: r,
            level: toArr(level)[i],
            points: Number(toArr(points)[i]) || 0,
            enclosure: toArr(enclosure)[i]
        })).filter(item => item.role && item.role.trim() !== "");

        await Part4.findOneAndUpdate(
            { user: req.user.id, academicYear: academicYear },
            { user: req.user.id, academicYear: academicYear, adminEntries: adminData },
            { upsert: true, new: true }
        );

        req.flash('success_msg', 'Part 4 saved successfully!');
        res.redirect('/users/faculty/facultyOverview');
    } catch (err) {
        res.redirect('/users/faculty/facultyOverview');
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
    }
});

module.exports = router;