import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Institution from "../models/institutionModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import { generateTokens } from "../utils/jwt.js";
import { NODE_ENV , COOKIE_DOMAIN} from "../config/env.js";

// Cookie configuration for different environments
const isProd = NODE_ENV === 'production';

const baseCookie = {
  httpOnly: true,
  secure: isProd,                     // must be true in prod
  sameSite: isProd ? 'none' : 'lax',  // cross-site needs 'none' in prod
  path: '/',
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
};

class AuthService {
  static async saveRefreshToken(
    token,
    userId = null,
    adminId = null,
    institutionId = null
  ) {
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
      ...baseCookie,
      maxAge: 15 * 60 * 1000,           // 15 min
    });
    res.cookie('refreshToken', refreshToken, {
      ...baseCookie,
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    });
  }

  static clearCookies(res) {
    res.clearCookie('accessToken', baseCookie);
    res.clearCookie('refreshToken', baseCookie);
  }
}

export default AuthService;
