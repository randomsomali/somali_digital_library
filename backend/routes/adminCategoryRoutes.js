import express from "express";
import {
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminCategoryController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
import { validateCategory } from "../middleware/validationMiddleware.js";

const router = express.Router();

// All routes are protected with admin authentication
// router.use(authenticate, authorizeAdmin());

// Get all categories with filters and pagination
router.get("/", getAllCategories);

// Get single category details
router.get("/:id", getCategoryDetails);

// Create new category
router.post("/", validateCategory(), createCategory);

// Update category
router.put("/:id", validateCategory(), updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

export default router;
