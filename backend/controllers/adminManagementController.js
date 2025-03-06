import Admin from "../models/adminModel.js";
import AuthService from "../services/authService.js";

export const getAllAdmins = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 15));

    const filters = {
      search: req.query.search,
      role: req.query.role,
      page,
      limit,
    };

    const { admins, total, totalPages } = await Admin.findAllForAdmin(filters);

    res.json({
      success: true,
      data: admins,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDetails = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdForAdmin(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { fullname, email, password, role } = req.body;

    // Validate required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Fullname, email, and password are required",
      });
    }

    // Validate role if provided
    if (role && !["admin", "staff"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role. Must be 'admin' or 'staff'",
      });
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    const adminId = await Admin.create({
      fullname,
      email,
      password: hashedPassword,
      role: role || "staff",
    });

    const admin = await Admin.findByIdForAdmin(adminId);

    res.status(201).json({
      success: true,
      data: admin,
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

export const updateAdmin = async (req, res, next) => {
  try {
    const { fullname, email, password, role } = req.body;

    const admin = await Admin.findByIdForAdmin(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    // Validate role if provided
    if (role && !["admin", "staff"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role. Must be 'admin' or 'staff'",
      });
    }

    // Prepare update data
    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await AuthService.hashPassword(password);
    }
    if (role) updateData.role = role;

    const updatedAdmin = await Admin.update(req.params.id, updateData);

    res.json({
      success: true,
      data: updatedAdmin,
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

export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdForAdmin(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    // Prevent deleting the last admin
    const { admins } = await Admin.findAllForAdmin({ role: "admin" });
    if (admin.role === "admin" && admins.length <= 1) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete the last admin account",
      });
    }

    await Admin.delete(req.params.id);

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
