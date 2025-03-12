const mongoose = require('mongoose');

const userOTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiry: { type: Date, required: true }
},{
    timestamps: true
});

userOTPSchema.index({email:1});

module.exports = mongoose.model('UserOTP', userOTPSchema);