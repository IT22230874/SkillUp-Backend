const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const passport = require('passport');
const jwt = require('../utils/jwt');
const { upload, uploadToCloudinary } = require('../utils/cloudinary');

router.post('/register', register);
router.post('/login', login);

// Get current user info (role)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ username: user.username, role: user.role === undefined ? null : user.role });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// Google OAuth2 login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth2 callback
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
  // Generate JWT for the user
  const token = jwt.generateToken(req.user._id);
  // Redirect to frontend with token as query param
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
});

// Update user role (for Google OAuth users who need to complete signup)
router.post('/set-role', authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.user, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Role updated', role: user.role });
  } catch {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Upload profile or course image
router.post('/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = await uploadToCloudinary(req.file.buffer, req.body.folder || 'profile_pics');
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
