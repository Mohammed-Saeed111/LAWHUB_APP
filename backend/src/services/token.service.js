import jwt from 'jsonwebtoken';

export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' });

export const verifyAccessToken = (t) => jwt.verify(t, process.env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (t) => jwt.verify(t, process.env.JWT_REFRESH_SECRET);

export const issueAuthTokens = (user) => {
  const payload = { id: user._id.toString(), role: user.role };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
};
