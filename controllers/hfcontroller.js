// ============================================================
// hfController.js  —  MOSTAFA's file
// Exports four functions used by other controllers:
//   classifyJob, extractSkillsFromBio, getEmbeddings, generateCoverLetter
// ============================================================
const hf = require('../services/hfService');

/**
 * Zero-shot classify a job description.
 * Called inside jobController.createJob and jobController.updateJob.
 * Returns the top-scoring label string.
 */
const classifyJob = async (description) => {
  try {
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: [description],
      parameters: {
        candidate_labels: ['Frontend', 'Backend', 'AI/ML', 'DevOps', 'Data Engineering', 'Other'],
      },
    });
    return result[0].labels[0];
  } catch (err) {
    console.error('HF classify error:', err.message);
    return 'Other';
  }
};

/**
 * NER-based skill extraction.
 * Called inside profileController.extractSkills.
 * Returns a clean, deduplicated array of skill strings.
 */
const extractSkillsFromBio = async (bio) => {
  try {
    const result = await hf.tokenClassification({
      model: 'dslim/bert-base-NER',
      inputs: bio,
    });
    const skills = result
      .filter(e => ['B-MISC', 'I-MISC', 'B-ORG'].includes(e.entity_group))
      .map(e => e.word.replace(/^##/, '').trim())
      .filter(w => w.length > 1);
    return [...new Set(skills)];
  } catch (err) {
    console.error('HF NER error:', err.message);
    return null;
  }
};

/**
 * Sentence embeddings for job recommendations.
 * Called inside jobController.getRecommendedJobs.
 */
const getEmbeddings = async (inputs) => {
  try {
    const embeddings = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs,
    });
    return embeddings;
  } catch (err) {
    console.error('HF embedding error:', err.message);
    return null;
  }
};

/**
 * Cosine similarity between two numeric vectors.
 */
const cosineSimilarity = (vecA, vecB) => {
  const dot  = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
};

/**
 * Generate a cover letter draft based on student bio and job details.
 * Uses facebook/bart-large-cnn summarization model.
 */
const generateCoverLetter = async (bio, jobTitle, jobDescription, company) => {
  try {
    const prompt = `Write a professional cover letter for a ${jobTitle} position at ${company}. The applicant's background: ${bio}. Job description: ${jobDescription}`;

    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: prompt,
      parameters: {
        max_length: 300,
        min_length: 100,
      },
    });

    return result.summary_text;
  } catch (err) {
    console.error('HF cover letter error:', err.message);
    throw new Error('Failed to generate cover letter. Please try again.');
  }
};

/**
 * Express route handler: POST /api/v1/jobs/:id/generate-cover-letter
 */
const generateCoverLetterForJob = async (req, res, next) => {
  try {
    const User = require('../models/userModel');
    const JobPost = require('../models/JobPost');

    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const user = await User.findById(req.user._id);
    const bio = user.bio?.trim();
    if (!bio) {
      return res.status(400).json({
        success: false,
        message: 'Your bio is empty. Add a bio in your profile first so we can tailor the cover letter.',
      });
    }

    const coverLetter = await generateCoverLetter(bio, job.title, job.description, job.company);
    return res.status(200).json({ success: true, coverLetter });
  } catch (err) {
    next(err);
  }
};

module.exports = { classifyJob, extractSkillsFromBio, getEmbeddings, cosineSimilarity, generateCoverLetter, generateCoverLetterForJob };
