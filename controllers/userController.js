// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Register user route' });
};

// @desc    Login user / Return JWT Token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Login user route' });
};

// @desc    Get user profile & extract skills using Hugging Face
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Get profile route' });
};
