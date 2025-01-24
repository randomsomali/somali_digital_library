const Download = require("../models/downloadModel");

exports.createDownload = async (req, res) => {
  const { resource_id } = req.body;

  try {
    const result = await Download.createDownload(resource_id, 1);
    res.status(201).json({
      message: "Download logged successfully.",
      downloadId: result.insertId,
    });
  } catch (err) {
    console.error("Error logging download:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getAllDownloads = async (req, res) => {
  const filters = req.query; // e.g., ?resource_id=1&user_id=2

  try {
    const downloads = await Download.getAllDownloads(filters);
    res.status(200).json(downloads);
  } catch (err) {
    console.error("Error fetching downloads:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getDownloadsByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const downloads = await Download.getDownloadsByUserId(user_id);
    res.status(200).json(downloads);
  } catch (err) {
    console.error("Error fetching downloads by user ID:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getDownloadsByResource = async (req, res) => {
  const { resource_id } = req.params;

  try {
    const downloads = await Download.getDownloadsByResource(resource_id);
    res.status(200).json(downloads);
  } catch (err) {
    console.error("Error fetching downloads by resource ID:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
