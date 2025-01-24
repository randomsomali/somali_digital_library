const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.post("/logout", adminController.logout);
router.get("/me", authMiddleware.verifyToken, adminController.getCurrentAdmin); // Add this route

router.get("/", adminController.getAllAdmins);
router.post("/", adminController.createAdmin);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;
