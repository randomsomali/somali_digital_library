import express from "express";
import { upload } from "../config/cloudinary.js";
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
import { validateResource } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Protect all routes
// router.use(authenticate, authorizeAdmin());

// Routes with file upload handling
router.post("/", upload, validateResource(), createResource);
router.put("/:id", upload, validateResource(true), updateResource);

// Other routes
router.get("/", getAllResources);
router.get("/:id", getResourceDetails);
router.delete("/:id", deleteResource);
router.patch("/:id/status", updateResourceStatus);
router.patch("/:id/paid", updateResourcePaidStatus);

export default router;
