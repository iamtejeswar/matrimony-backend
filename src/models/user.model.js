const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile_number: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  password_hash: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  mobile_verified: { type: Boolean, default: false },
  auth_provider: { type: String, enum: ['mobile', 'google'], required: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
