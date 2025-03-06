import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';
import Institution from '../models/institutionModel.js';
import RefreshToken from '../models/refreshTokenModel.js';
import { generateTokens } from '../utils/jwt.js';

class AuthService {
  static async saveRefreshToken(token, userId = null, adminId = null, institutionId = null) {
    return RefreshToken.save(token, userId, adminId, institutionId);
  }

  static async invalidateRefreshToken(token) {
    await RefreshToken.invalidate(token);
  }

  static async validateRefreshToken(token) {
    return RefreshToken.findValid(token);
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  static async comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static setCookies(res, { accessToken, refreshToken }) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  static clearCookies(res) {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
  }
}

export default AuthService; 