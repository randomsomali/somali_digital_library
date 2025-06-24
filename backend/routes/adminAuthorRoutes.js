import express from "express";
import {
  getAllAuthors,
  getAuthorDetails,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/adminAuthorController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
import { validateAuthor } from "../middleware/validationMiddleware.js";

const router = express.Router();

// All routes are protected with admin authentication
router.use(authenticate, authorizeAdmin());

// Get all authors with filters and pagination
router.get("/", getAllAuthors);

// Get single author details
router.get("/:id", getAuthorDetails);

// Create new author
router.post("/", validateAuthor(), createAuthor);

// Update author
router.put("/:id", validateAuthor(), updateAuthor);

// Delete author
router.delete("/:id", deleteAuthor);

export default router;
