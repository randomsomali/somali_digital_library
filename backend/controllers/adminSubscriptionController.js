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
    // Parse features if it's a string
    let features = [];
    try {
      features =
        typeof req.body.features === "string"
          ? JSON.parse(req.body.features)
          : Array.isArray(req.body.features)
          ? req.body.features
          : [];
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid features format",
      });
    }

    const subscription = await Subscription.create({
      ...req.body,
      features,
    });

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error: "Subscription name already exists",
      });
    }
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    // Parse features if provided
    if (req.body.features) {
      try {
        req.body.features =
          typeof req.body.features === "string"
            ? JSON.parse(req.body.features)
            : Array.isArray(req.body.features)
            ? req.body.features
            : [];
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "Invalid features format",
        });
      }
    }

    const subscription = await Subscription.findByIdForAdmin(req.params.id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found",
      });
    }

    const updatedSubscription = await Subscription.update(
      req.params.id,
      req.body
    );
    res.json({
      success: true,
      data: updatedSubscription,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error: "Subscription name already exists",
      });
    }
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
