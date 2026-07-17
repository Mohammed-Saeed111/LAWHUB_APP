import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  register, verifyAccount, resendOtp, login, forgotPassword, resetPassword,
  refresh, logout, getMe, setupMfa, submitLawyerCredentials, enableBiometric,
} from '../controllers/auth.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadBarCard } from '../middlewares/upload.middleware.js';
import {
  registerValidator, loginValidator, otpValidator,
  emailOnlyValidator, resetPasswordValidator,
} from '../validators/auth.validators.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 30,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

// Public
router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/verify-otp', authLimiter, otpValidator, validate, verifyAccount);
router.post('/resend-otp', authLimiter, emailOnlyValidator, validate, resendOtp);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/forgot-password', authLimiter, emailOnlyValidator, validate, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validate, resetPassword);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Private
router.get('/me', protect, getMe);
router.patch('/mfa', protect, setupMfa);
router.post('/lawyer-credentials', protect, authorize('lawyer', 'office'), uploadBarCard, submitLawyerCredentials);
router.post('/biometric/enable', protect, enableBiometric);

export default router;
