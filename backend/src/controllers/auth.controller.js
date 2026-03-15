const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, CandidateProfile } = require('../models/index');

const VALID_ROLES = ['candidate', 'employer'];

const signToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!expiresIn) throw new Error('JWT_EXPIRES_IN is not configured');
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// Register — auto-verify, no OTP needed
exports.register = async (req, res) => {
  try {
    const { email, password, phone, role, firstName, lastName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'email, password and role are required' });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be candidate or employer' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      phone,
      role,
      isEmailVerified: true  // auto-verify — OTP disabled temporarily
    });

    if (role === 'candidate' && firstName) {
      await CandidateProfile.create({
        userId: user.id,
        firstName: firstName || '',
        lastName: lastName || ''
      });
    }

    // Issue token immediately after registration
    const token = signToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// verifyOTP — kept as stub so existing routes don't break
exports.verifyOTP = async (req, res) => {
  res.json({ success: true, message: 'Email verification is currently disabled.' });
};

// resendOTP — kept as stub
exports.resendOTP = async (req, res) => {
  res.json({ success: true, message: 'Email verification is currently disabled.' });
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    await user.update({ lastLogin: new Date() });

    const token = signToken(user.id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
