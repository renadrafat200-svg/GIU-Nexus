const JobPost = require('../models/JobPost');
const hf = require('../services/hfService');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from normal matching
    const removeFields = ['page', 'limit', 'keyword'];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Handle keyword search across multiple fields
    if (req.query.keyword) {
      reqQuery.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { company: { $regex: req.query.keyword, $options: 'i' } },
        { location: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    query = JobPost.find(reqQuery);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await JobPost.countDocuments(reqQuery);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const jobs = await query;

    res.status(200).json({
      success: true,
      total,
      page,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/v1/jobs
// @access  Private (Recruiter approved)
exports.createJob = async (req, res, next) => {
  try {
    // Check if recruiter is approved
    if (req.user.role === 'recruiter' && req.user.status === 'pending') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending approval. Wait for admin approval before posting jobs.' 
      });
    }

    // Add user to req.body
    req.body.createdBy = req.user._id;

    // AI Classification
    if (req.body.description) {
      try {
        const result = await hf.zeroShotClassification({
          model: "facebook/bart-large-mnli",
          inputs: [req.body.description],
          parameters: { candidate_labels: ["Frontend", "Backend", "AI/ML", "DevOps", "Data Engineering", "Other"] },
        });
        
        // highest-scoring label
        if (result && result.length > 0 && result[0].labels && result[0].labels.length > 0) {
            req.body.category = result[0].labels[0]; 
        } else {
            req.body.category = "Other";
        }
      } catch (hfError) {
        console.error('Hugging Face AI Classification failed:', hfError.message);
        req.body.category = "Other"; // Default fallback
      }
    }

    const job = await JobPost.create(req.body);

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id).populate({
      path: 'createdBy',
      select: 'name email'
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PATCH /api/v1/jobs/:id
// @access  Private (Recruiter owner)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is job owner
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised to edit this job' });
    }

    // Re-classify if description is being updated
    if (req.body.description && req.body.description !== job.description) {
      try {
        const result = await hf.zeroShotClassification({
          model: "facebook/bart-large-mnli",
          inputs: [req.body.description],
          parameters: { candidate_labels: ["Frontend", "Backend", "AI/ML", "DevOps", "Data Engineering", "Other"] },
        });
        if (result && result.length > 0 && result[0].labels && result[0].labels.length > 0) {
            req.body.category = result[0].labels[0]; 
        }
      } catch (hfError) {
        console.error('Hugging Face AI Classification failed:', hfError.message);
        req.body.category = "Other";
      }
    }

    job = await JobPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Recruiter owner or Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is job owner or admin
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};
