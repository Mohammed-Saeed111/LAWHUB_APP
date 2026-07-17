import Otp from '../models/otp.model.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtpEmail } from './email.service.js';
import ApiError from '../utils/ApiError.js';

const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES) || 10;
const MAX_ATTEMPTS = 5;

export const createAndSendOtp = async ({ user, purpose, channel = 'email' }) => {
  await Otp.deleteMany({ user: user._id, purpose });
  const code = generateOtp(6);
  const codeHash = await Otp.hashCode(code);
  await Otp.create({
    user: user._id, purpose, channel, codeHash,
    expiresAt: new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000),
  });
  if (channel === 'email') await sendOtpEmail(user.email, code);
  return { expiresInMinutes: OTP_EXPIRES_MINUTES };
};

export const verifyOtp = async ({ user, purpose, code }) => {
  const record = await Otp.findOne({ user: user._id, purpose });
  if (!record) throw ApiError.badRequest('OTP expired or not found. Request a new one.');
  if (record.attempts >= MAX_ATTEMPTS) {
    await record.deleteOne();
    throw ApiError.badRequest('Too many attempts. Please request a new code.');
  }
  const ok = await record.compareCode(code);
  if (!ok) { record.attempts += 1; await record.save(); throw ApiError.badRequest('Invalid verification code.'); }
  await record.deleteOne();
  return true;
};
