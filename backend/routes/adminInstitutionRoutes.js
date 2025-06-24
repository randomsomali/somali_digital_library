import express from "express";
import {
  getAllInstitutions,
  getInstitutionDetails,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/adminInstitutionController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
import { validateInstitution } from "../middleware/validationMiddleware.js";

const router = express.Router();

// All routes are protected with admin authentication
router.get("/public", getAllInstitutions);

router.use(authenticate, authorizeAdmin());

// Get all institutions with filters and pagination
router.get("/", getAllInstitutions);

// Get single institution details
router.get("/:id", getInstitutionDetails);

// Create new institution with validation
router.post("/", validateInstitution(false), createInstitution);

// Update institution with validation
router.put("/:id", validateInstitution(true), updateInstitution);

// Delete institution
router.delete("/:id", deleteInstitution);

export default router;
