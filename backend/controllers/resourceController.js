import Resource from "../models/resourceModel.js";
import { cloudinaryUtils } from "../config/cloudinary.js";
export const getResources = async (req, res, next) => {
  try {
    // Validate and sanitize pagination params
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 15));

    const filters = {
      search: req.query.search,
      type: req.query.type,
      category_id: req.query.category_id,
      language: req.query.language,
      year: req.query.year,
      page,
      limit,
    };

    const { resources, total, totalPages } = await Resource.findAll(filters);

    res.json({
      success: true,
      data: resources,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    // Only generate download URL for free resources in public endpoint
    // Premium resources will require authentication and subscription check
    if (resource.paid === "free" && resource.file_public_id) {
      resource.download_url = await cloudinaryUtils.generateSignedUrl(
        resource.file_public_id
      );
    }

    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const resourceId = await Resource.create(req.body);
    const resource = await Resource.findById(resourceId);

    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.update(req.params.id, req.body);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResourceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["published", "unpublished"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const resource = await Resource.updateStatus(req.params.id, status);
    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResourcePaidStatus = async (req, res, next) => {
  try {
    const { paid } = req.body;
    if (!["free", "premium"].includes(paid)) {
      return res.status(400).json({
        success: false,
        error: "Invalid paid status value",
      });
    }

    const resource = await Resource.updatePaidStatus(req.params.id, paid);
    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    await Resource.delete(req.params.id);
    res.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// New endpoint for downloading resources with subscription checks
export const downloadResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From authenticated user

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    // For free resources, allow download and log it
    if (resource.paid === "free") {
      if (userId) {
        await Resource.logDownload(userId, id);
      }

      const downloadUrl = await cloudinaryUtils.generateSignedUrl(
        resource.file_public_id
      );

      return res.json({
        success: true,
        data: {
          download_url: downloadUrl,
          message: "Download URL generated successfully",
        },
      });
    }

    // For premium resources, check subscription
    if (resource.paid === "premium") {
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required for premium resources",
          requiresAuth: true,
        });
      }

      // Get user info
      const userInfo = await Resource.getUserInstitution(userId);
      if (!userInfo) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      let hasSubscription = false;
      let subscriptionInfo = null;

      // Check if user has direct subscription
      if (userInfo.role === "user") {
        subscriptionInfo = await Resource.checkUserSubscription(userId);
        hasSubscription = !!subscriptionInfo;
      }

      // Check institution subscription for students
      if (userInfo.role === "student" && userInfo.institution_id) {
        subscriptionInfo = await Resource.checkInstitutionSubscription(
          userInfo.institution_id
        );
        hasSubscription = !!subscriptionInfo;
      }

      if (!hasSubscription) {
        return res.status(403).json({
          success: false,
          error:
            userInfo.role === "student"
              ? "Your institution needs an active subscription to access this resource"
              : "Active subscription required for premium resources",
          requiresSubscription: true,
          userRole: userInfo.role,
        });
      }

      // Log download and generate URL
      await Resource.logDownload(userId, id);
      const downloadUrl = await cloudinaryUtils.generateSignedUrl(
        resource.file_public_id
      );

      return res.json({
        success: true,
        data: {
          download_url: downloadUrl,
          message: "Download URL generated successfully",
          subscription: subscriptionInfo,
        },
      });
    }

    res.status(400).json({
      success: false,
      error: "Invalid resource type",
    });
  } catch (error) {
    next(error);
  }
};
