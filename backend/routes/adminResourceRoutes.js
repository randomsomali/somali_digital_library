import express from "express";
import {
  getAllResources,
  getResourceDetails,
  createResource,
  updateResource,
  deleteResource,
  updateResourceStatus,
  updateResourcePaidStatus,
} from "../controllers/adminResourceController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// All routes are protected with admin authentication
router.use(authenticate, authorizeAdmin());

// Get all resources with filters and pagination
router.get("/", getAllResources);

// Get single resource details
router.get("/:id", getResourceDetails);

// Create new resource with file upload
router.post("/", upload.single("file"), createResource);

// Update resource
router.put("/:id", upload.single("file"), updateResource);

// Delete resource
router.delete("/:id", deleteResource);

// Update resource status (published/unpublished)
router.patch("/:id/status", updateResourceStatus);

// Update resource paid status (free/premium)
router.patch("/:id/paid", updateResourcePaidStatus);

export default router;
