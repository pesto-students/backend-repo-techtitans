const crypto = require('crypto');
const nodemailer = require('nodemailer');

const otpStore = new Map(); // Replace with a database or cache in production

function generateOTP(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2))
               .toString('hex')
               .slice(0, length)
               .toUpperCase();
}

function storeOTP(email, otp) {
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // OTP valid for 10 minutes
}

function verifyOTP(email, otp) {
  const record = otpStore.get(email);
  if (record && record.otp === otp && record.expiresAt > Date.now()) {
    otpStore.delete(email); // OTP is valid, remove it from the store
    return true;
  }
  return false;
}
