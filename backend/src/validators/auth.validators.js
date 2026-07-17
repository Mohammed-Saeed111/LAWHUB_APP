import { body } from 'express-validator';

const egyptPhone = /^(\+?20|0)?1[0125]\d{8}$/;

export const registerValidator = [
  body('fullName').trim().isLength({ min: 3, max: 80 }).withMessage('Full name must be 3–80 characters.'),
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('phone').trim().matches(egyptPhone).withMessage('A valid Egyptian phone number is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Add an uppercase letter.')
    .matches(/[a-z]/).withMessage('Add a lowercase letter.')
    .matches(/\d/).withMessage('Add a number.'),
  body('role').optional().isIn(['client', 'lawyer', 'office']).withMessage('Invalid account type.'),
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

export const otpValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('code').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
];

export const emailOnlyValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
];

export const resetPasswordValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('code').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Add an uppercase letter.').matches(/\d/).withMessage('Add a number.'),
];
