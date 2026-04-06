const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Part4Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    academicYear: { type: String, required: true },

    // ✅ Administrative Roles (OPTIONAL)
    adminEntries: [
        {
            role: { type: String },       // e.g. Exam Coordinator
            level: { type: String },      // Dept / Institute / University
            enclosure: { type: String }
        }
    ],

    // ✅ FINAL DECLARATION (IMPORTANT)
    declaration: {
        agreed: { type: Boolean, default: false },  // checkbox
        place: { type: String },                    // e.g. Solapur
        date: { type: Date },                       // submission date
        signature: { type: String }                 // typed name
    },

    // ✅ FINAL STATUS
    isSubmitted: { type: Boolean, default: false },

    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('part4', Part4Schema);