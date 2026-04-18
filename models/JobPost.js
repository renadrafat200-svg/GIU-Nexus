const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobPostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true,
    validate: [v => v.length > 0, 'Requirements cannot be empty']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'internship']
  },
  salary: {
    type: Number,
    required: false
  },
  category: {
    type: String,
    enum: ["Frontend", "Backend", "AI/ML", "DevOps", "Data Engineering", "Other"],
    default: "Other"
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } }); // Fulfills "createdAt timestamp"

module.exports = mongoose.model('JobPost', jobPostSchema);
