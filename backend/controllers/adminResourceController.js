import Resource from "../models/resourceModel.js";
import {
  cloudinary,
  generateSignedUrl,
  getPublicIdFromUrl,
} from "../config/cloudinary.js";

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

    // Generate a signed URL for the file that expires in 1 hour
    if (resource.file_url) {
      const publicId = getPublicIdFromUrl(resource.file_url);
      resource.download_url = await generateSignedUrl(publicId);
      // Don't send the original file_url to clients
      delete resource.file_url;
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

    // Upload file to Cloudinary with private access
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "SBL/resources",
      public_id: `${Date.now()}-${req.file.originalname}`,
      access_mode: "authenticated",
      type: "private",
    });

    const resourceData = {
      ...req.body,
      file_url: result.secure_url,
      file_public_id: `${result.public_id}`, // Store public_id for future reference
      status: req.body.status || "unpublished",
      paid: req.body.paid || "free",
    };

    const resourceId = await Resource.create(resourceData);
    const resource = await Resource.findByIdForAdmin(resourceId);

    // Generate initial signed URL for immediate use
    const downloadUrl = await generateSignedUrl(result.public_id);

    res.status(201).json({
      success: true,
      data: {
        ...resource,
        download_url: downloadUrl,
        file_url: undefined, // Don't send the original file_url
      },
    });
  } catch (error) {
    // Delete uploaded file if resource creation fails
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id, {
        resource_type: "raw",
      });
    }
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const existingResource = await Resource.findByIdForAdmin(req.params.id);
    if (!existingResource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    let resourceData = { ...req.body };

    // If new file is uploaded
    if (req.file) {
      // Delete old file from Cloudinary
      if (existingResource.file_public_id) {
        await cloudinary.uploader.destroy(existingResource.file_public_id, {
          resource_type: "raw",
        });
      }

      // Upload new file
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "SBL/resources",
        public_id: `${Date.now()}-${req.file.originalname}`,
        access_mode: "authenticated",
        type: "private",
      });

      resourceData.file_url = result.secure_url;
      resourceData.file_public_id = `${result.public_id}`;
    }

    const resource = await Resource.update(req.params.id, resourceData);

    // Generate new signed URL if file exists
    let downloadUrl;
    if (resource.file_public_id) {
      downloadUrl = await generateSignedUrl(resource.file_public_id);
    }

    res.json({
      success: true,
      data: {
        ...resource,
        download_url: downloadUrl,
        file_url: undefined, // Don't send the original file_url
      },
    });
  } catch (error) {
    next(error);
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
    if (resource.file_public_id) {
      await cloudinary.uploader.destroy(resource.file_public_id, {
        resource_type: "raw",
      });
    }

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
