import Subscription from "../models/subscriptionModel.js";

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 15));

    const filters = {
      search: req.query.search,
      type: req.query.type,
      page,
      limit,
    };

    const { subscriptions, total, totalPages } =
      await Subscription.findAllForAdmin(filters);

    res.json({
      success: true,
      data: subscriptions,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdForAdmin(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found",
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const { name, type, price, duration_days } = req.body;

    // Validate required fields
    if (!name || !type || !price || !duration_days) {
      return res.status(400).json({
        success: false,
        error: "Name, type, price, and duration_days are required",
      });
    }

    // Validate type
    if (!["user", "institution"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid type. Must be 'user' or 'institution'",
      });
    }

    // Validate price and duration
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        error: "Price must be a positive number",
      });
    }

    if (!Number.isInteger(duration_days) || duration_days <= 0) {
      return res.status(400).json({
        success: false,
        error: "Duration days must be a positive integer",
      });
    }

    const subscriptionId = await Subscription.create({
      name,
      type,
      price: parseFloat(price),
      duration_days: parseInt(duration_days),
    });

    const subscription = await Subscription.findByIdForAdmin(subscriptionId);

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { name, type, price, duration_days } = req.body;

    const subscription = await Subscription.findByIdForAdmin(req.params.id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found",
      });
    }

    // Validate type if provided
    if (type && !["user", "institution"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid type. Must be 'user' or 'institution'",
      });
    }

    // Validate price if provided
    if (price !== undefined && (isNaN(price) || price <= 0)) {
      return res.status(400).json({
        success: false,
        error: "Price must be a positive number",
      });
    }

    // Validate duration if provided
    if (
      duration_days !== undefined &&
      (!Number.isInteger(parseInt(duration_days)) || duration_days <= 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "Duration days must be a positive integer",
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (duration_days !== undefined)
      updateData.duration_days = parseInt(duration_days);

    const updatedSubscription = await Subscription.update(
      req.params.id,
      updateData
    );

    res.json({
      success: true,
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdForAdmin(req.params.id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found",
      });
    }

    // Check if subscription has active users or institutions
    if (subscription.active_users > 0 || subscription.active_institutions > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete subscription with active users or institutions",
      });
    }

    await Subscription.delete(req.params.id);

    res.json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
