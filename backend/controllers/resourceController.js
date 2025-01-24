const Resource = require("../models/resourceModel");
const { cloudinary } = require("../config/cloudinary");

exports.createResource = async (req, res) => {
  const {
    title,
    author,
    abstract,
    year_of_publication,
    language,
    category_id,
    type,
    keywords,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  try {
    const fileUrl = req.file.path; // Cloudinary URL
    const resourceId = await Resource.createResource({
      title,
      author,
      abstract,
      year_of_publication,
      language,
      category_id,
      type,
      keywords,
      file_url: fileUrl,
    });
    res
      .status(201)
      .json({ message: "Resource created successfully", id: resourceId });
  } catch (err) {
    console.error("Error creating resource:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllResources = async (req, res) => {
  const filters = req.query; // e.g., ?category_id=1&type=book
  try {
    const resources = await Resource.getAllResources(filters);
    res.status(200).json(resources);
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllResourcesnext = async (req, res) => {
  const filters = req.query; // e.g., ?category_id=1&type=book
  try {
    const resources = await Resource.getAllResourcesnext(filters);
    res.status(200).json(resources);
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getResourceById = async (req, res) => {
  const { id } = req.params;
  try {
    const resource = await Resource.getResourceById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json(resource);
  } catch (err) {
    console.error("Error fetching resource:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateResource = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    author,
    abstract,
    year_of_publication,
    language,
    category_id,
    type,
    keywords,
  } = req.body;

  const updatedData = {
    title,
    author,
    abstract,
    year_of_publication,
    language,
    category_id,
    type,
    keywords,
  };

  if (req.file) {
    updatedData.file_url = req.file.path; // Cloudinary URL
  }

  try {
    await Resource.updateResource(id, updatedData);
    res.status(200).json({ message: "Resource updated successfully" });
  } catch (err) {
    console.error("Error updating resource:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteResource = async (req, res) => {
  const { id } = req.params;
  try {
    await Resource.deleteResource(id);
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Error deleting resource:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
