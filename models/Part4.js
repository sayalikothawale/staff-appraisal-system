const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Part4Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    academicYear: { type: String, required: true },
<<<<<<< HEAD

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
=======
    adminEntries: [{
        role: { type: String, required: true }, // e.g., Exam Coordinator, Lab In-charge
        level: { type: String }, // e.g., Department, Institute, University
        points: { type: Number, default: 0 },
        enclosure: { type: String }
    }],
    date: { type: Date, default: Date.now }
});

mongoose.model('part4', Part4Schema);
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
