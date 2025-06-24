import UserSubscription from "../models/userSubscriptionModel.js";
import { validateUserSubscription } from "../middleware/validationMiddleware.js";

// Get all user subscriptions with pagination and filters
export const getAllUserSubscriptions = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      status: req.query.status,
      type: req.query.type,
      payment_method: req.query.payment_method,
    };

    const result = await UserSubscription.findAllForAdmin(filters);

    res.json({
      success: true,
      data: result.userSubscriptions,
      total: result.total,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user subscriptions",
    });
  }
};

// Get user subscription by ID
export const getUserSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userSubscription = await UserSubscription.findByIdForAdmin(id);

    if (!userSubscription) {
      return res.status(404).json({
        success: false,
        error: "User subscription not found",
      });
    }

    res.json({
      success: true,
      data: userSubscription,
    });
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user subscription",
    });
  }
};

// Create new user subscription
export const createUserSubscription = async (req, res) => {
  try {
    const validation = validateUserSubscription(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: validation.errors,
      });
    }

    // Add confirmed_by from admin session
    const subscriptionData = {
      ...req.body,
      confirmed_by: req.user.id,
    };
    const userSubscription = await UserSubscription.create(subscriptionData);

    res.status(201).json({
      success: true,
      data: userSubscription,
      message: "User subscription created successfully",
    });
  } catch (error) {
    console.error("Error creating user subscription:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to create user subscription",
    });
  }
};

// Update user subscription
export const updateUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    // const validation = validateUserSubscription(req.body, true);
    // if (!validation.isValid) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "Validation failed",
    //     errors: validation.errors,
    //   });
    // }

    // Add confirmed_by from admin session if status is being updated
    const updateData = { ...req.body };
    if (req.body.status && req.body.status !== "pending") {
      updateData.confirmed_by = req.user.id;
    }

    const userSubscription = await UserSubscription.update(id, updateData);

    res.json({
      success: true,
      data: userSubscription,
      message: "User subscription updated successfully",
    });
  } catch (error) {
    console.error("Error updating user subscription:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to update user subscription",
    });
  }
};

// Delete user subscription
export const deleteUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    await UserSubscription.delete(id);

    res.json({
      success: true,
      message: "User subscription deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user subscription:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to delete user subscription",
    });
  }
};

// Get dropdown data for forms
export const getDropdownData = async (req, res) => {
  try {
    const [subscriptions, users, institutions] = await Promise.all([
      UserSubscription.getAllSubscriptions(),
      UserSubscription.getUsersForDropdown(),
      UserSubscription.getInstitutionsForDropdown(),
    ]);

    res.json({
      success: true,
      data: {
        subscriptions,
        users,
        institutions,
      },
    });
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dropdown data",
    });
  }
};

// Check if user/institution has active subscription
export const checkActiveSubscription = async (req, res) => {
  try {
    const { user_id, institution_id } = req.query;

    if (!user_id && !institution_id) {
      return res.status(400).json({
        success: false,
        error: "Either user_id or institution_id is required",
      });
    }

    const hasActive = await UserSubscription.checkActiveSubscription(
      user_id,
      institution_id
    );

    res.json({
      success: true,
      data: {
        hasActiveSubscription: hasActive,
      },
    });
  } catch (error) {
    console.error("Error checking active subscription:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check active subscription",
    });
  }
};

// Check if a user has an active subscription
export const checkUserActiveSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const hasActive = await UserSubscription.hasActiveSubscriptionForUser(
      userId
    );
    res.json({ success: true, active: hasActive });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Check if an institution has an active subscription
export const checkInstitutionActiveSubscription = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const hasActive =
      await UserSubscription.hasActiveSubscriptionForInstitution(institutionId);
    res.json({ success: true, active: hasActive });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
