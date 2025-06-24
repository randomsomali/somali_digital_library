import Resource from "../models/resourceModel.js";
import Category from "../models/categoryModel.js";
import Author from "../models/authorModel.js";
import { cloudinaryUtils } from "../config/cloudinary.js";

export const getAllResources = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 15));

    const filters = {
      search: req.query.search,
      type: req.query.type,
      category_id: req.query.category_id,
      language: req.query.language,
      year: req.query.year,
      status: req.query.status,
      paid: req.query.paid,
      page,
      limit,
    };

    const { resources, total, totalPages } = await Resource.findAllForAdmin(
      filters
    );

    // Don't generate signed URLs for listing to improve performance
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

export const getResourceDetails = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdForAdmin(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    // Generate a signed URL that expires in 1 hour
    if (resource.file_public_id) {
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
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Resource file is required",
      });
    }

    // Validate category
    const categoryExists = await Category.exists(req.body.category_id);
    if (!categoryExists) {
      await cloudinaryUtils.cleanupUpload(req.file);
      return res.status(400).json({
        success: false,
        error: "Invalid category ID",
      });
    }

    // Validate and parse author IDs
    let authorIds = [];
    try {
      authorIds = JSON.parse(req.body.author_ids || "[]");
      if (!Array.isArray(authorIds) || authorIds.length === 0) {
        throw new Error("At least one author is required");
      }
      // Validate all authors exist
      const validAuthors = await Author.validateAuthors(authorIds);
      if (!validAuthors) {
        throw new Error("One or more invalid author IDs");
      }
    } catch (error) {
      await cloudinaryUtils.cleanupUpload(req.file);
      return res.status(400).json({
        success: false,
        error: error.message || "Invalid author IDs format",
      });
    }

    // Create resource with file info
    const resource = await Resource.create({
      ...req.body,
      file_public_id: req.file.filename,
      author_ids: authorIds,
    });

    if (resource && resource["0"]) {
      resource["0"].download_url = await cloudinaryUtils.generateSignedUrl(
        resource["0"].file_public_id
      );
    }

    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    await cloudinaryUtils.cleanupUpload(req.file);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to create resource",
    });
  }
};

export const updateResource = async (req, res, next) => {
  try {
    // First check if resource exists
    const existingResource = await Resource.findByIdForAdmin(req.params.id);
    if (!existingResource) {
      if (req.file) {
        await cloudinaryUtils.cleanupUpload(req.file);
      }
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    // Validate category if provided
    if (req.body.category_id) {
      const categoryExists = await Category.exists(req.body.category_id);
      if (!categoryExists) {
        if (req.file) {
          await cloudinaryUtils.cleanupUpload(req.file);
        }
        return res.status(400).json({
          success: false,
          error: "Invalid category ID",
        });
      }
    }

    // Validate author IDs if provided
    let authorIds = undefined;
    if (req.body.author_ids) {
      try {
        authorIds = JSON.parse(req.body.author_ids);
        if (!Array.isArray(authorIds)) {
          throw new Error("Author IDs must be an array");
        }
        if (authorIds.length > 0) {
          const validAuthors = await Author.validateAuthors(authorIds);
          if (!validAuthors) {
            throw new Error("One or more invalid author IDs");
          }
        }
      } catch (error) {
        if (req.file) {
          await cloudinaryUtils.cleanupUpload(req.file);
        }
        return res.status(400).json({
          success: false,
          error: error.message || "Invalid author IDs format",
        });
      }
    }

    // Handle file update
    let file_public_id = existingResource.file_public_id;
    if (req.file) {
      // Delete old file before updating
      await cloudinaryUtils.deleteFile(existingResource.file_public_id);
      file_public_id = req.file.filename;
    }

    // Update resource
    const updatedResource = await Resource.update(req.params.id, {
      ...req.body,
      file_public_id,
      author_ids: authorIds,
    });

    // Generate download URL
    if (updatedResource) {
      updatedResource.download_url = await cloudinaryUtils.generateSignedUrl(
        updatedResource.file_public_id
      );
    }

    res.json({
      success: true,
      data: updatedResource,
    });
  } catch (error) {
    // Clean up uploaded file if update fails
    if (req.file) {
      await cloudinaryUtils.cleanupUpload(req.file);
    }
    res.status(400).json({
      success: false,
      error: error.message || "Failed to update resource",
    });
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdForAdmin(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    // Delete file from Cloudinary
    await cloudinaryUtils.deleteFile(resource.file_public_id);

    // Delete resource (will cascade delete author associations)
    await Resource.delete(req.params.id);

    res.json({
      success: true,
      message: "Resource deleted successfully",
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
