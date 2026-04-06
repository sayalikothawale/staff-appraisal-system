const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

const Part2 = mongoose.model('part2');

// ✅ GET PART 2 PAGE
router.get('/view/:year', ensureAuthenticated, async (req, res) => {
    try {
        const selectedYear = req.params.year;

        const existingData = await Part2.findOne({
            user: req.user.id,
            academicYear: selectedYear
        }).lean();

        res.render('parts/part2', {
            academicYear: selectedYear,

            // Send saved data to UI
            savedFdp: existingData ? existingData.fdp : [],
            savedMooc: existingData ? existingData.mooc : [],
            savedTraining: existingData ? existingData.training : []
        });

    } catch (err) {
        console.error(err);
        res.redirect('/users/faculty/facultyOverview');
    }
});


// ✅ SAVE PART 2
router.post('/save', ensureAuthenticated, async (req, res) => {
    try {
        let {
            fdpTitle, fdpOrg, fdpFrom, fdpTo, fdpWeeks,
            moocTitle, moocFrom, moocTo, moocWeeks,
            trainInst, trainFrom, trainTo, trainWeeks,
            academicYear
        } = req.body;

        // Utility function
        const toArr = (val) => Array.isArray(val) ? val : (val ? [val] : []);

        // 🔵 FDP DATA
        const fdpData = toArr(fdpTitle).map((t, i) => ({
            title: t,
            organizedBy: toArr(fdpOrg)[i],
            fromDate: toArr(fdpFrom)[i],
            toDate: toArr(fdpTo)[i],
            durationWeeks: toArr(fdpWeeks)[i]
        })).filter(item => item.title && item.title.trim() !== "");

        // 🔵 MOOC DATA (OPTIONAL)
        const moocData = toArr(moocTitle).map((t, i) => ({
            courseTitle: t,
            fromDate: toArr(moocFrom)[i],
            toDate: toArr(moocTo)[i],
            durationWeeks: toArr(moocWeeks)[i]
        })).filter(item => item.courseTitle && item.courseTitle.trim() !== "");

        // 🔵 TRAINING DATA (OPTIONAL)
        const trainingData = toArr(trainInst).map((t, i) => ({
            instituteName: t,
            fromDate: toArr(trainFrom)[i],
            toDate: toArr(trainTo)[i],
            durationWeeks: toArr(trainWeeks)[i]
        })).filter(item => item.instituteName && item.instituteName.trim() !== "");

        // ✅ SAVE TO DB
        await Part2.findOneAndUpdate(
            {
                user: req.user.id,
                academicYear: academicYear
            },
            {
                user: req.user.id,
                academicYear: academicYear,

                fdp: fdpData,
                mooc: moocData,
                training: trainingData
            },
            { upsert: true, new: true }
        );

        req.flash('success_msg', 'Part 2 saved successfully!');

        // ✅ SAVE & NEXT → PART 3
        res.redirect(`/part3/view/${academicYear}`);

    } catch (err) {
        console.error("Part2 Save Error:", err);
        req.flash('error_msg', 'Error saving Part 2');
        res.redirect('/users/faculty/facultyOverview');
    }
});

module.exports = router;