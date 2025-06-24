import { verifyToken, generateTokens } from "../utils/jwt.js";
import AuthService from "../services/authService.js";
import pool from "../config/db.js";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Institution from "../models/institutionModel.js";

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      AuthService.clearCookies(res);
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Verify access token
    const decoded = verifyToken(accessToken);
    if (decoded) {
      req.user = decoded;
      return next();
    }
    // Access token expired, try refresh token
    if (refreshToken) {
      const storedToken = await AuthService.validateRefreshToken(refreshToken);
      if (!storedToken) {
        AuthService.clearCookies(res);
        return res.status(401).json({
          success: false,
          error: "Invalid refresh token",
        });
      }

      // Generate new tokens
      let userData;
      if (storedToken.user_id) {
        const user = await User.findById(storedToken.user_id);
        userData = { id: user.user_id, type: "user", role: user.role };
      } else if (storedToken.admin_id) {
        const admin = await Admin.findById(storedToken.admin_id);
        userData = { id: admin.admin_id, type: "admin", role: admin.role };
      } else if (storedToken.institution_id) {
        const institution = await Institution.findById(
          storedToken.institution_id
        );
        userData = { id: institution.institution_id, type: "institution" };
      }

      const tokens = generateTokens(userData);

      // Save new refresh token
      await AuthService.invalidateRefreshToken(refreshToken);
      await AuthService.saveRefreshToken(
        tokens.refreshToken,
        storedToken.user_id,
        storedToken.admin_id,
        storedToken.institution_id
      );

      // Set new cookies
      AuthService.setCookies(res, tokens);

      req.user = userData;
      return next();
    }

    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user || !allowedTypes.includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        error: "Access forbidden",
      });
    }
    next();
  };
};

export const authorizeAdmin = (allowedRoles = ["admin", "staff"]) => {
  return (req, res, next) => {
    if (
      !req.user ||
      req.user.type !== "admin" ||
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }
    next();
  };
};
