const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.post(
  "/",
  authMiddleware.verifyTokenAndRole("admin"),
  upload.single("file"), // Assuming the file input name is 'file'
  resourceController.createResource
);

router.get("/", resourceController.getAllResources);
router.get("/filter", resourceController.getAllResourcesnext);

router.get("/:id", resourceController.getResourceById);
router.put(
  "/:id",
  authMiddleware.verifyTokenAndRole("admin"),
  upload.single("file"),
  resourceController.updateResource
);
router.delete(
  "/:id",
  authMiddleware.verifyTokenAndRole("admin"),
  resourceController.deleteResource
);

module.exports = router;
