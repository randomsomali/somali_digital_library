import User from "../models/userModel.js";
import AuthService from "../services/authService.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 15));

    const filters = {
      search: req.query.search,
      role: req.query.role,
      sub_status: req.query.sub_status,
      page,
      limit,
    };

    const { users, total, totalPages } = await User.findAllForAdmin(filters);

    res.json({
      success: true,
      data: users,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findByIdForAdmin(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, institution_id, sub_status } =
      req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Name, email, password, and role are required",
      });
    }

    // Validate role
    if (!["user", "student"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role. Must be 'user' or 'student'",
      });
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      institution_id,
      sub_status,
    });

    const user = await User.findByIdForAdmin(userId);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role, institution_id, sub_status } =
      req.body;

    const user = await User.findByIdForAdmin(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // If role is provided, validate it
    if (role && !["user", "student"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role. Must be 'user' or 'student'",
      });
    }

    // If sub_status is provided, validate it
    if (sub_status && !["none", "active", "expired"].includes(sub_status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid subscription status",
      });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await AuthService.hashPassword(password);
    }
    if (role) updateData.role = role;
    if (institution_id !== undefined)
      updateData.institution_id = institution_id;
    if (sub_status) updateData.sub_status = sub_status;

    const updatedUser = await User.update(req.params.id, updateData);

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdForAdmin(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    await User.delete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
