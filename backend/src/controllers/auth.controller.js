const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, CandidateProfile } = require('../models/index');
const emailService = require('../services/email/emailService');

const VALID_ROLES = ['candidate', 'employer'];

const signToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!expiresIn) throw new Error('JWT_EXPIRES_IN is not configured');
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, phone, role, firstName, lastName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'email, password and role are required' });
    }

    // Prevent self-assigning admin role
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be candidate or employer' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      phone,
      role,
      otp,
      otpExpiry
    });

    if (role === 'candidate' && firstName) {
      await CandidateProfile.create({
        userId: user.id,
        firstName: firstName || '',
        lastName: lastName || ''
      });
    }

    await emailService.sendOTPEmail(email, otp);
    await emailService.sendWelcomeEmail(email, firstName || email);

    // Do NOT issue a token here — require OTP verification first
    res.status(201).json({
      success: true,
      message: 'Account created! Please verify your email with the OTP sent.',
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'userId and otp are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    await user.update({ isEmailVerified: true, otp: null, otpExpiry: null });

    // Token is issued only after successful OTP verification
    const token = signToken(user.id);

    res.json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ otp, otpExpiry });
    await emailService.sendOTPEmail(user.email, otp);

    res.json({ success: true, message: 'OTP resent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login — only allow verified users
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

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        userId: user.id
      });
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
