const bcrypt = require('bcryptjs');
const UserOTPs = require('../models/userOTPs');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.verifyUser = async (req, res) => {
    try {
        const email = req.user?.email || req.body.email;
        const otp = req.body.otp;

        if (!email || !otp) {
            return res.status(400).json({ success: false, error: 'Email and OTP are required' });
        }

        const userOTP = await UserOTPs.findOne({ email });
        if (!userOTP) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if (userOTP.expiry < Date.now()) {
            return res.status(400).json({ success: false, error: 'OTP expired' });
        }

        const isMatch = await bcrypt.compare(otp, userOTP.otp); // Compare plain OTP with hashed OTP
        if (isMatch) {
            return res.status(200).json({ success: true, message: 'User verified successfully' });
        } else {
            return res.status(400).json({ success: false, error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.sendOTP = async (req, res) => {
    const auth = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: '2022btcse002@curaj.ac.in',
            pass: process.env.PASSWORD // Fix incorrect env variable usage
        }
    });

    const email = req.body.email;
    let otp = Math.floor(100000 + Math.random() * 900000).toString(); // Fix: use let instead of const
    const expiry = Date.now() + 600000; // 10 minutes expiry

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(otp, salt);

        await UserOTPs.findOneAndUpdate(
            { email },
            { email, otp: hash, expiry }, // Fix: store hash in `otp` field
            { new: true, upsert: true }
        );
    } catch (error) {
        console.error('Error generating OTP:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }

    const mailOptions = {
        from: '2022btcse002@curaj.ac.in',
        to: email,
        subject: 'OTP for account verification',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 400px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333;">Your OTP Code</h2>
                    <p style="font-size: 18px; color: #555;">Use the code below to complete your verification:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #007BFF; padding: 10px; background: #f0f8ff; border-radius: 5px; display: inline-block;">
                        ${otp}
                    </div>
                    <p style="color: #888; margin-top: 10px;">This code will expire in 10 minutes.</p>
                </div>
            </div>
        `
    };

    auth.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    });
};
