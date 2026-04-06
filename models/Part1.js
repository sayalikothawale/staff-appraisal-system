const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Part1Schema = new Schema({
<<<<<<< HEAD

  user: { type: Schema.Types.ObjectId, ref: 'users' },
  academicYear: { type: String, default: '2024-25' },

  // 🔵 A. TEACHING PROCESS
  teaching: [
    {
      semester: String,
      courseName: String,
      type: String, // L / P / T
      scheduledClasses: Number,
      heldClasses: Number,
      enclosure: String
    }
  ],

  // 🔵 B. STUDENT FEEDBACK
  studentFeedback: [
    {
      semester: String,
      courseName: String,
      feedbackScore: Number,
      enclosure: String
    }
  ],

  // 🔵 C. DEPARTMENTAL ACTIVITIES
  departmentalActivities: [
    {
      semester: String,
      activity: String
    }
  ],

  // 🔵 D. INSTITUTE ACTIVITIES
  instituteActivities: [
    {
      semester: String,
      activity: String
    }
  ],

  // 🔵 E. CONTRIBUTION TO SOCIETY
  societyContribution: [
    {
      semester: String,
      activity: String
    }
  ]

});

=======
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    academicYear: { type: String, default: '2024-25' },
    // Ensure this is an Array of Objects
    courses: [{
    semester: { type: String },
    courseName: { type: String },
    type: { type: String },
    scheduled: { type: Number },
    actuallyHeld: { type: Number },
    points: { type: Number },
    enclosure: { type: String }
}]
});

// Use 'part1' as the model name
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
module.exports = mongoose.model('part1', Part1Schema);