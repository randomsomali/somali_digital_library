import Institution from "../models/institutionModel.js";
import AuthService from "../services/authService.js";

export const getAllInstitutions = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 15));

    const filters = {
      search: req.query.search,
      sub_status: req.query.sub_status,
      page,
      limit,
    };

    const { institutions, total, totalPages } = await Institution.findAllForAdmin(filters);

    res.json({
      success: true,
      data: institutions,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstitutionDetails = async (req, res, next) => {
  try {
    const institution = await Institution.findByIdForAdmin(req.params.id);
    
    if (!institution) {
      return res.status(404).json({
        success: false,
        error: "Institution not found",
      });
    }

    res.json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
};

export const createInstitution = async (req, res, next) => {
  try {
    // Validation is now handled by middleware
    const hashedPassword = await AuthService.hashPassword(req.body.password);
    const institution = await Institution.create({
      ...req.body,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const field = error.message.includes("email") ? "email" : "name";
      return res.status(400).json({
        success: false,
        error: `Institution ${field} already exists`,
      });
    }
    next(error);
  }
};

export const updateInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findByIdForAdmin(req.params.id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        error: "Institution not found",
      });
    }

    // Hash password if provided
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await AuthService.hashPassword(updateData.password);
    }

    const updatedInstitution = await Institution.update(req.params.id, updateData);

    res.json({
      success: true,
      data: updatedInstitution,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const field = error.message.includes("email") ? "email" : "name";
      return res.status(400).json({
        success: false,
        error: `Institution ${field} already exists`,
      });
    }
    next(error);
  }
};

export const deleteInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findByIdForAdmin(req.params.id);
    
    if (!institution) {
      return res.status(404).json({
        success: false,
        error: "Institution not found",
      });
    }

    // Check if institution has active users
    if (institution.user_count > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete institution with associated users",
      });
    }

    await Institution.delete(req.params.id);

    res.json({
      success: true,
      message: "Institution deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}; 