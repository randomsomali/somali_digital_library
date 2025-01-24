const pool = require("../config/db");

class User {
  static async getAllUsers() {
    const query = "SELECT * FROM users ORDER BY id DESC";
    const [rows] = await pool.query(query);
    return rows;
  }

  static async createUser(newUser) {
    const [result] = await pool.query("INSERT INTO users SET ?", newUser);
    return result;
  }

  static async updateUser(id, updatedUser) {
    const query = "UPDATE users SET ? WHERE id = ?";
    const [result] = await pool.query(query, [updatedUser, id]);
    return result;
  }

  static async deleteUser(id) {
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await pool.query(query, [id]);
    return result;
  }

  static async getUserByUsername(username) {
    const query = "SELECT * FROM users WHERE username = ?";
    const [rows] = await pool.query(query, [username]);
    return rows[0];
  }

  static async findUserByUsernameOrPhone(username, phone) {
    const query = "SELECT * FROM users WHERE username = ? OR phone = ?";
    const [rows] = await pool.query(query, [username, phone]);
    return rows[0];
  }

  static async getUserById(id) {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = User;
