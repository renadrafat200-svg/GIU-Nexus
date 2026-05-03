const { HfInference } = require("@huggingface/inference");

// Initialize once and export the singleton as required by Milestone 2
const hf = new HfInference(process.env.HF_TOKEN);

module.exports = hf;
