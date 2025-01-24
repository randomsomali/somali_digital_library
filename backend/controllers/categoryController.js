// controllers/categoryController.js
const Category = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  const { category_name, description } = req.body;

  try {
    const id = await Category.createCategory(category_name, description);
    res.status(201).json({ message: "Category created successfully", id });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCategory = async (req, res) => {
  const { category_id } = req.params;
  const { category_name, description } = req.body;

  try {
    await Category.updateCategory(category_id, category_name, description);
    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { category_id } = req.params;

  try {
    await Category.deleteCategory(category_id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
