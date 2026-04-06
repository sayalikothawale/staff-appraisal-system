const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Part1Schema = new Schema({

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

module.exports = mongoose.model('part1', Part1Schema);