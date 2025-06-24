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
    // Validation is now handled by middleware
    if (req.body.password) {
      req.body.password = await AuthService.hashPassword(req.body.password);
    }
    const userId = await User.create(req.body);
    const user = await User.findByIdForAdmin(userId);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // Check for duplicate email error from MySQL
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
    const user = await User.findByIdForAdmin(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Validation is now handled by middleware
    // Hash password if provided
    if (req.body.password) {
      req.body.password = await AuthService.hashPassword(req.body.password);
    }
    const updatedUser = await User.update(req.params.id, req.body);

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    // Check for duplicate email error from MySQL
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
    // Prevent deleting the last user
    const { users } = await User.findAllForAdmin({ role: "user" });
    if (user.role === "user" && users.length <= 1) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete the last user account",
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

export const getInstitutionStudents = async (req, res, next) => {
  try {
    const institutionId = req.params.institutionId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 15));

    const filters = {
      search: req.query.search,
      sub_status: req.query.sub_status,
      page,
      limit,
    };

    const { users, total, totalPages } =
      await User.findAllStudentsByInstitution(institutionId, filters);

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
