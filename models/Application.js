const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'JobPost',
    required: true
  },
  coverLetter: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: { createdAt: 'appliedAt', updatedAt: false } }); // Fulfills "appliedAt timestamp"

// Student cannot apply to same job twice at schema level enforcement 
// (a compound unique index resolves this easily)
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
