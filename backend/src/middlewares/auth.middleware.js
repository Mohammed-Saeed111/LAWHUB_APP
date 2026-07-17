import { verifyAccessToken } from '../services/token.service.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Require a valid access token. Attaches the full user (req.user) AND a
 * convenience req.userId — Phase B (client-journey) controllers read req.userId.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];
  else if (req.cookies?.accessToken) token = req.cookies.accessToken;
  if (!token) throw ApiError.unauthorized('Authentication required.');

  let decoded;
  try { decoded = verifyAccessToken(token); }
  catch { throw ApiError.unauthorized('Invalid or expired token.'); }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('User no longer exists.');
  req.user = user;
  req.userId = user._id;          // ← unifies Phase 0 (req.user) and Phase B (req.userId)
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw ApiError.forbidden('You do not have permission.');
  next();
};
