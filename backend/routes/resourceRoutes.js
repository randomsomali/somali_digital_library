import express from "express";
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  updateResourceStatus,
  updateResourcePaidStatus,
  deleteResource,
  downloadResource,
} from "../controllers/resourceController.js";
import { getAllSubscriptions } from "../controllers/adminSubscriptionController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
import Subscription from "../models/subscriptionModel.js";

const router = express.Router();

// Public routes
router.get("/", getResources);
router.get("/:id", getResourceById);

// Public subscription plans endpoint
router.get("/subscriptions/plans", getAllSubscriptions);

// Protected routes (admin only)
router.post("/", authenticate, authorizeAdmin(), createResource);
router.put("/:id", authenticate, authorizeAdmin(), updateResource);
router.patch(
  "/:id/status",
  authenticate,
  authorizeAdmin(),
  updateResourceStatus
);
router.patch(
  "/:id/paid",
  authenticate,
  authorizeAdmin(),
  updateResourcePaidStatus
);
router.delete("/:id", authenticate, authorizeAdmin(), deleteResource);

// Download route (requires authentication)
router.post("/:id/download", authenticate, downloadResource);

export default router;
