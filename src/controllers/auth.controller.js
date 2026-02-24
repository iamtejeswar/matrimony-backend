const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const generateOTP = require('../utils/generateOTP');

let otpStore = {};

exports.sendOTP = async (req, res) => {
  const { mobile_number } = req.body;

  const otp = generateOTP();

  otpStore[mobile_number] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  };

  console.log("OTP:", otp);

  res.json({ success: true, message: "OTP sent successfully" });
};

exports.register = async (req, res) => {
  try {
    const { full_name, email, mobile_number, gender, password, otp } = req.body;

    if (!otpStore[mobile_number] || otpStore[mobile_number].otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (otpStore[mobile_number].expires < Date.now())
      return res.status(400).json({ success: false, message: "OTP Expired" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      mobile_number,
      gender,
      password_hash: hashedPassword,
      mobile_verified: true,
      auth_provider: "mobile"
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({
      success: true,
      message: "User registered successfully",
      token
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email_or_mobile, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: email_or_mobile }, { mobile_number: email_or_mobile }]
  });

  if (!user)
    return res.status(400).json({ success: false, message: "User not found" });

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match)
    return res.status(400).json({ success: false, message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ success: true, token });
};
