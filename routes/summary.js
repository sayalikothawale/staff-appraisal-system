const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

const Part1 = mongoose.model('part1');
const Part2 = mongoose.model('part2');
const Part3 = mongoose.model('part3');
const Part4 = mongoose.model('part4');
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
        const [p1, p2, p3, p4] = await Promise.all([
            Part1.findOne({ user: userId, academicYear: year }).lean(),
            Part2.findOne({ user: userId, academicYear: year }).lean(),
            Part3.findOne({ user: userId, academicYear: year }).lean(),
            Part4.findOne({ user: userId, academicYear: year }).lean()
        ]);

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
            totalP1: totalP1.toFixed(2),
            totalP2: totalP2.toFixed(2),
            totalP3: totalP3.toFixed(2),
            totalP4: totalP4.toFixed(2),
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
        res.redirect('/users/faculty/facultyOverview');
    }
});

module.exports = router;