const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

// Load Model
const Part1 = mongoose.model('part1');

<<<<<<< HEAD

// ================= GET PART 1 =================
router.get('/view/:year', ensureAuthenticated, async (req, res) => {
    try {
        const selectedYear = req.params.year;

        const existingData = await Part1.findOne({
            user: req.user.id,
            academicYear: selectedYear
        }).lean();

        res.render('parts/part1', {
            academicYear: selectedYear,

            // SEND ALL SECTIONS
            teaching: existingData ? existingData.teaching : [],
            studentFeedback: existingData ? existingData.studentFeedback : [],
            departmentalActivities: existingData ? existingData.departmentalActivities : [],
            instituteActivities: existingData ? existingData.instituteActivities : [],
            societyContribution: existingData ? existingData.societyContribution : []
        });

    } catch (err) {
        console.error(err);
        res.redirect('/users/faculty/facultyOverview');
    }
});


// ================= SAVE PART 1 =================
router.post('/save', ensureAuthenticated, async (req, res) => {
    try {

        const { academicYear } = req.body;

        // Helper function
        const toArr = (val) => Array.isArray(val) ? val : (val ? [val] : []);

        // ================= A. TEACHING =================
        const teaching = [];

        const courseArr = toArr(req.body.courseName);

        for (let i = 0; i < courseArr.length; i++) {
            if (courseArr[i]) {
                teaching.push({
                    semester: toArr(req.body.semester)[i] || "",
                    courseName: courseArr[i],
                    type: toArr(req.body.type)[i] || "",
                    scheduledClasses: Number(toArr(req.body.scheduledClasses)[i]) || 0,
                    heldClasses: Number(toArr(req.body.heldClasses)[i]) || 0,
                    enclosure: toArr(req.body.enclosure)[i] || ""
                });
            }
        }

        // ================= B. STUDENT FEEDBACK =================
        const studentFeedback = [];

        const feedbackCourse = toArr(req.body.f_course);

        for (let i = 0; i < feedbackCourse.length; i++) {
            if (feedbackCourse[i]) {
                studentFeedback.push({
                    semester: toArr(req.body.f_semester)[i] || "",
                    courseName: feedbackCourse[i],
                    feedbackScore: Number(toArr(req.body.feedbackScore)[i]) || 0,
                    enclosure: toArr(req.body.f_enclosure)[i] || ""
                });
            }
        }

        // ================= C. DEPARTMENTAL =================
        const departmentalActivities = [];
        toArr(req.body.deptActivity).forEach(a => {
            if (a && a.trim() !== "") {
                departmentalActivities.push({ activity: a });
            }
        });

        // ================= D. INSTITUTE =================
        const instituteActivities = [];
        toArr(req.body.instActivity).forEach(a => {
            if (a && a.trim() !== "") {
                instituteActivities.push({ activity: a });
            }
        });

        // ================= E. SOCIETY =================
        const societyContribution = [];
        toArr(req.body.socActivity).forEach(a => {
            if (a && a.trim() !== "") {
                societyContribution.push({ activity: a });
            }
        });

        // ================= SAVE =================
        await Part1.findOneAndUpdate(
            { user: req.user.id, academicYear: academicYear },
            {
                user: req.user.id,
                academicYear: academicYear,

                teaching,
                studentFeedback,
                departmentalActivities,
                instituteActivities,
                societyContribution
=======
// routes/part1.js
router.get('/view/:year', ensureAuthenticated, async (req, res) => {
    try {
        const selectedYear = req.params.year;
        const existingData = await Part1.findOne({ 
            user: req.user.id, 
            academicYear: selectedYear 
        }).lean(); // <--- THIS .lean() IS REQUIRED

        res.render('parts/part1', {
            academicYear: selectedYear,
            savedCourses: existingData ? existingData.courses : [] 
        });
    } catch (err) {
        res.redirect('/users/faculty/facultyOverview');
    }
});
// POST Route
router.post('/save', ensureAuthenticated, async (req, res) => {
    try {
        // 1. Destructure 'academicYear' from req.body
        let { semester, course, type, scheduled, held, points, enclosure, academicYear } = req.body;
        
        const toArr = (val) => Array.isArray(val) ? val : [val];
        const courses = toArr(course);

        const teachingEntries = courses.map((cName, i) => ({
            semester: toArr(semester)[i] || "Sem-I",
            courseName: cName,
            type: toArr(type)[i] || "L",
            scheduled: Number(toArr(scheduled)[i]) || 0,
            actuallyHeld: Number(toArr(held)[i]) || 0,
            points: parseFloat(toArr(points)[i]) || 0,
            enclosure: toArr(enclosure)[i] || ""
        })).filter(entry => entry.courseName && entry.courseName.trim() !== "");

        // 2. CRITICAL: Use the academicYear variable from the form
        await Part1.findOneAndUpdate(
            { user: req.user.id, academicYear: academicYear }, 
            { 
                user: req.user.id,
                academicYear: academicYear, // Now it will save 2025-26
                courses: teachingEntries 
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
            },
            { upsert: true, new: true }
        );

<<<<<<< HEAD
        req.flash('success_msg', `Part 1 (${academicYear}) saved successfully!`);
        res.redirect('/part2/view/' + academicYear); // SAVE & NEXT

    } catch (err) {
        console.error("Part1 Save Error:", err);
        req.flash('error_msg', 'Failed to save Part 1');
=======
        req.flash('success_msg', `Teaching Process for ${academicYear} updated successfully!`);
        res.redirect('/users/faculty/facultyOverview');

    } catch (err) {
        console.error("Save Error:", err);
        req.flash('error_msg', 'Failed to save data.');
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
        res.redirect('/users/faculty/facultyOverview');
    }
});

module.exports = router;