import express from "express";
import {
  getAllSubscriptions,
  getSubscriptionDetails,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "../controllers/adminSubscriptionController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected with admin authentication
router.use(authenticate, authorizeAdmin());

// Get all subscriptions with filters and pagination
router.get("/", getAllSubscriptions);

// Get single subscription details
router.get("/:id", getSubscriptionDetails);

// Create new subscription
router.post("/", createSubscription);

// Update subscription
router.put("/:id", updateSubscription);

// Delete subscription
router.delete("/:id", deleteSubscription);

export default router;
