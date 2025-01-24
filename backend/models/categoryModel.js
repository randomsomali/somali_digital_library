// models/categoryModel.js
const pool = require("../config/db");

class Category {
  static async createCategory(category_name, description) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        "INSERT INTO categories (category_name, description) VALUES (?, ?)",
        [category_name, description]
      );
      await connection.commit();
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async getAllCategories() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query("SELECT * FROM categories");
      return rows;
    } finally {
      connection.release();
    }
  }

  static async updateCategory(category_id, category_name, description) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        "UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?",
        [category_name, description, category_id]
      );
      await connection.commit();
    } finally {
      connection.release();
    }
  }

  static async deleteCategory(category_id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query("DELETE FROM categories WHERE category_id = ?", [
        category_id,
      ]);
      await connection.commit();
    } finally {
      connection.release();
    }
  }
}

module.exports = Category;
