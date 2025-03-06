import Resource from "../models/resourceModel.js";
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
