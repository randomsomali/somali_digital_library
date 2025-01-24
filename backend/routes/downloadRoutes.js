const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");

// Log a new download
router.post("/", downloadController.createDownload);

// Get all downloads (with optional filters)
router.get("/", downloadController.getAllDownloads);

// Get downloads by user ID
router.get("/user/:user_id", downloadController.getDownloadsByUserId);

// Get downloads by resource ID
router.get("/resource/:resource_id", downloadController.getDownloadsByResource);

module.exports = router;
