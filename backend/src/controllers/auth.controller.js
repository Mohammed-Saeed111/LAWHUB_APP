import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createAndSendOtp, verifyOtp } from '../services/otp.service.js';
import { issueAuthTokens, verifyRefreshToken, signAccessToken } from '../services/token.service.js';

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/** POST /api/auth/register — create account + send verification OTP. */
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, preferredLanguage } = req.body;
  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) throw ApiError.conflict('An account with this email or phone already exists.');

  const user = await User.create({ fullName, email, phone, password, role, preferredLanguage });
  await createAndSendOtp({ user, purpose: 'verify', channel: 'email' });

  res.status(201).json({
    success: true,
    message: 'Account created. A verification code has been sent to your email.',
    data: { userId: user._id, email: user.email, role: user.role, requiresVerification: true },
  });
});

/** POST /api/auth/verify-otp — verify account, returns tokens. */
export const verifyAccount = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound('Account not found.');
  if (user.isEmailVerified) throw ApiError.badRequest('Account is already verified.');

  await verifyOtp({ user, purpose: 'verify', code });
  user.isEmailVerified = true;
  await user.save();

  const { accessToken, refreshToken } = issueAuthTokens(user);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  res.json({ success: true, message: 'Account verified successfully.', data: { user, accessToken } });
});

/** POST /api/auth/resend-otp */
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound('Account not found.');
  if (user.isEmailVerified) throw ApiError.badRequest('Account is already verified.');
  const { expiresInMinutes } = await createAndSendOtp({ user, purpose: 'verify', channel: 'email' });
  res.json({ success: true, message: `A new code has been sent. Expires in ${expiresInMinutes} minutes.` });
});

/** POST /api/auth/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw ApiError.unauthorized('Invalid email or password.');
  if (!user.isActive) throw ApiError.forbidden('Your account has been deactivated.');

  if (!user.isEmailVerified) {
    await createAndSendOtp({ user, purpose: 'verify', channel: 'email' });
    return res.status(403).json({
      success: false,
      message: 'Please verify your account. A new code has been sent.',
      data: { requiresVerification: true, email: user.email },
    });
  }

  user.lastLoginAt = new Date();
  await user.save();
  const { accessToken, refreshToken } = issueAuthTokens(user);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  res.json({ success: true, message: 'Logged in successfully.', data: { user, accessToken } });
});

/** POST /api/auth/forgot-password */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) await createAndSendOtp({ user, purpose: 'reset', channel: 'email' });
  res.json({ success: true, message: 'If an account exists for this email, a reset code has been sent.' });
});

/** POST /api/auth/reset-password */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound('Account not found.');
  await verifyOtp({ user, purpose: 'reset', code });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
});

/** POST /api/auth/refresh */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized('No refresh token provided.');
  let decoded;
  try { decoded = verifyRefreshToken(token); }
  catch { throw ApiError.unauthorized('Invalid refresh token.'); }
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('User no longer exists.');
  const accessToken = signAccessToken({ id: user._id.toString(), role: user.role });
  res.json({ success: true, data: { accessToken } });
});

/** POST /api/auth/logout */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', refreshCookieOptions);
  res.json({ success: true, message: 'Logged out successfully.' });
});

/** GET /api/auth/me */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

/** PATCH /api/auth/mfa — configure multi-factor security (Screen 6). */
export const setupMfa = asyncHandler(async (req, res) => {
  const { methods = [], enabled = true } = req.body;
  const allowed = ['app', 'sms', 'email'];
  req.user.mfaMethods = methods.filter((m) => allowed.includes(m));
  req.user.mfaEnabled = enabled && req.user.mfaMethods.length > 0;
  await req.user.save();
  res.json({ success: true, message: 'Security preferences saved.', data: { user: req.user } });
});

/** POST /api/auth/lawyer-credentials — submit bar card + details (Screen 7). */
export const submitLawyerCredentials = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!['lawyer', 'office'].includes(user.role))
    throw ApiError.forbidden('Only professional accounts can submit credentials.');

  const { barNumber, specialization, firmName } = req.body;
  if (barNumber) user.barNumber = barNumber;
  if (specialization) user.specialization = specialization;
  if (firmName) user.firmName = firmName;
  if (req.file) user.barCardUrl = `/${req.file.path}`;

  user.isProfileComplete = true;
  user.accountStatus = 'pending_review'; // Screen 8: 48h review cycle
  await user.save();

  res.json({
    success: true,
    message: 'Credentials submitted. Your account is now under review (up to 48 hours).',
    data: { user },
  });
});

/** POST /api/auth/biometric/enable — flag biometric login (Screen 9). */
export const enableBiometric = asyncHandler(async (req, res) => {
  req.user.biometricEnabled = true;
  await req.user.save();
  res.json({ success: true, message: 'Biometric login enabled.', data: { user: req.user } });
});
