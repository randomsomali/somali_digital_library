import express from "express";
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  updateResourceStatus,
  updateResourcePaidStatus,
  deleteResource,
} from "../controllers/resourceController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getResources);
router.get("/:id", getResourceById);

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

export default router;
