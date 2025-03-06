import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Institution from "../models/institutionModel.js";
import AuthService from "../services/authService.js";
import { generateTokens } from "../utils/jwt.js";

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await User.findByEmail(email, true);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "No user found with this email",
      });
    }

    const isValid = await AuthService.comparePasswords(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }

    const tokens = generateTokens({
      id: user.user_id,
      type: "user",
      role: user.role,
    });

    await AuthService.saveRefreshToken(tokens.refreshToken, user.user_id);
    AuthService.setCookies(res, tokens);

    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        sub_status: user.sub_status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginInstitution = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const institution = await Institution.findByEmail(email, true);
    if (!institution) {
      return res.status(401).json({
        success: false,
        error: "No institution found with this email",
      });
    }

    const isValid = await AuthService.comparePasswords(
      password,
      institution.password
    );
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }

    const tokens = generateTokens({
      id: institution.institution_id,
      type: "institution",
    });

    await AuthService.saveRefreshToken(
      tokens.refreshToken,
      null,
      null,
      institution.institution_id
    );
    AuthService.setCookies(res, tokens);

    res.json({
      success: true,
      message: "Logged in successfully",
      institution: {
        id: institution.institution_id,
        name: institution.name,
        email: institution.email,
        sub_status: institution.sub_status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const admin = await Admin.findByEmail(email, true);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "No admin found with this email",
      });
    }

    const isValid = await AuthService.comparePasswords(
      password,
      admin.password
    );
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }

    const tokens = generateTokens({
      id: admin.admin_id,
      type: "admin",
      role: admin.role,
    });

    await AuthService.saveRefreshToken(
      tokens.refreshToken,
      null,
      admin.admin_id
    );
    AuthService.setCookies(res, tokens);

    res.json({
      success: true,
      message: "Logged in successfully",
      admin: {
        id: admin.admin_id,
        email: admin.email,
        fullname: admin.fullname,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await AuthService.invalidateRefreshToken(refreshToken);
    }

    AuthService.clearCookies(res);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        sub_status: user.sub_status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.user.id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        error: "Institution not found",
      });
    }

    res.json({
      success: true,
      institution: {
        id: institution.institution_id,
        name: institution.name,
        email: institution.email,
        sub_status: institution.sub_status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin.admin_id,
        email: admin.email,
        fullname: admin.fullname,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const { fullname, email, currentPassword, newPassword } = req.body;
    const adminId = req.user.id;

    // Get current admin
    const admin = await Admin.findById(adminId, true);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: "Current password is required to change password",
        });
      }

      const isValid = await AuthService.comparePasswords(
        currentPassword,
        admin.password
      );
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }
    }

    // Update admin
    const updatedAdmin = await Admin.update(adminId, {
      fullname,
      email,
      password: newPassword, // Will be hashed in the model
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: updatedAdmin.admin_id,
        email: updatedAdmin.email,
        fullname: updatedAdmin.fullname,
        role: updatedAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
