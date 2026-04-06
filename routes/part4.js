const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

const Part4 = mongoose.model('part4');


// ✅ GET PART 4 PAGE
router.get('/view/:year', ensureAuthenticated, async (req, res) => {
    try {
        const selectedYear = req.params.year;

        const existingData = await Part4.findOne({
            user: req.user.id,
            academicYear: selectedYear
        }).lean();

        res.render('parts/part4', {
            academicYear: selectedYear,
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
    }
});

module.exports = router;