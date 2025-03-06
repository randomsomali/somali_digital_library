import Category from "../models/categoryModel.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
