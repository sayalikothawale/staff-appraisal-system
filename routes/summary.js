const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

<<<<<<< HEAD
=======
// Load Part Models
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
const Part1 = mongoose.model('part1');
const Part2 = mongoose.model('part2');
const Part3 = mongoose.model('part3');
const Part4 = mongoose.model('part4');
<<<<<<< HEAD
const AcademicYear = mongoose.model('academic_year');

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;

        // ================= GET LATEST YEAR =================
        const activeYear = await AcademicYear.findOne({ user: userId })
            .sort({ date: -1 });

        if (!activeYear) {
            req.flash('error_msg', 'No academic year found');
            return res.redirect('/users/faculty/facultyOverview');
        }

        const year = activeYear.academic_year;

        // ================= FETCH DATA =================
=======

router.get('/view/:year', ensureAuthenticated, async (req, res) => {
    try {
        const year = req.params.year;
        const userId = req.user.id;

        // Fetch all parts simultaneously
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
        const [p1, p2, p3, p4] = await Promise.all([
            Part1.findOne({ user: userId, academicYear: year }).lean(),
            Part2.findOne({ user: userId, academicYear: year }).lean(),
            Part3.findOne({ user: userId, academicYear: year }).lean(),
            Part4.findOne({ user: userId, academicYear: year }).lean()
        ]);

<<<<<<< HEAD
        // ================= SAFE SUM FUNCTION =================
        const safeSum = (arr) => {
            if (!Array.isArray(arr)) return 0;

            return arr.reduce((sum, item) => {
                return sum + (parseFloat(item.points) || 0);
            }, 0);
        };

        // ================= CALCULATIONS =================
        const totalP1 = safeSum(p1?.courses);
        const totalP2 = safeSum(p2?.researchEntries);
        const totalP3 = safeSum(p3?.innovationEntries);
        const totalP4 = safeSum(p4?.adminEntries);

        const grandTotal = totalP1 + totalP2 + totalP3 + totalP4;

        // ================= RENDER =================
        res.render('parts/summary', {
            year,

            // Full data (safe fallback)
            part1: p1 || {},
            part2: p2 || {},
            part3: p3 || {},
            part4: p4 || {},

            // Totals
=======
        // Calculate Totals - Ensuring we handle null/missing data safely
        const totalP1 = p1 ? p1.courses.reduce((s, c) => s + (parseFloat(c.points) || 0), 0) : 0;
        const totalP2 = p2 ? p2.researchEntries.reduce((s, r) => s + (parseFloat(r.points) || 0), 0) : 0;
        const totalP3 = p3 ? p3.innovationEntries.reduce((s, i) => s + (parseFloat(i.points) || 0), 0) : 0;
        const totalP4 = p4 ? p4.adminEntries.reduce((s, a) => s + (parseFloat(a.points) || 0), 0) : 0;

        // MATCHING THE FILENAME: parts/summary.handlebars
        res.render('parts/summary', {
            year,
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
            totalP1: totalP1.toFixed(2),
            totalP2: totalP2.toFixed(2),
            totalP3: totalP3.toFixed(2),
            totalP4: totalP4.toFixed(2),
<<<<<<< HEAD
            grandTotal: grandTotal.toFixed(2),

            // Flags
            hasP1: !!p1,
            hasP2: !!p2,
            hasP3: !!p3,
            hasP4: !!p4
        });

    } catch (err) {
        console.error("SUMMARY ERROR:", err);

        req.flash('error_msg', 'Error loading summary');
=======
            grandTotal: (totalP1 + totalP2 + totalP3 + totalP4).toFixed(2)
        });
    } catch (err) {
        console.error("Summary Error:", err);
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
        res.redirect('/users/faculty/facultyOverview');
    }
});

module.exports = router;