const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/register", userController.register);
router.get("/me", authMiddleware.verifyToken, userController.getCurrentUser); // Add this route

router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
