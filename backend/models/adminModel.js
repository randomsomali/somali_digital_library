const pool = require("../config/db");

class Admin {
  static async getAllAdmins() {
    const query = "SELECT * FROM admins ORDER BY id DESC";
    const [rows] = await pool.query(query);
    return rows;
  }

  static async createAdmin(newAdmin) {
    const [result] = await pool.query("INSERT INTO admins SET ?", newAdmin);
    return result;
  }

  static async updateAdmin(id, updatedAdmin) {
    const query = "UPDATE admins SET ? WHERE id = ?";
    const [result] = await pool.query(query, [updatedAdmin, id]);
    return result;
  }

  static async deleteAdmin(id) {
    const query = "DELETE FROM admins WHERE id = ?";
    const [result] = await pool.query(query, [id]);
    return result;
  }

  static async getAdminByUsername(username) {
    const query = "SELECT * FROM admins WHERE username = ?";
    const [rows] = await pool.query(query, [username]);
    return rows[0];
  }
  static async getAdminById(id) {
    const query = "SELECT * FROM admins WHERE id = ?";
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Admin;
