const pool = require("../config/db");

class Download {
  static async createDownload(resource_id, user_id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        "INSERT INTO downloads (resource_id, user_id) VALUES (?, ?)",
        [resource_id, user_id]
      );
      await connection.commit();
      return result;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getDownloadsByResource(resource_id) {
    const connection = await pool.getConnection();
    try {
      const query = "SELECT * FROM downloads WHERE resource_id = ?";
      const [rows] = await connection.query(query, [resource_id]);
      return rows;
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getAllDownloads(filters) {
    const connection = await pool.getConnection();
    try {
      let query = "SELECT * FROM downloads WHERE 1=1";
      const params = [];

      if (filters.resource_id) {
        query += " AND resource_id = ?";
        params.push(filters.resource_id);
      }
      if (filters.user_id) {
        query += " AND user_id = ?";
        params.push(filters.user_id);
      }

      const [rows] = await connection.query(query, params);
      return rows;
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getDownloadsByUserId(user_id) {
    const connection = await pool.getConnection();
    try {
      const query = "SELECT * FROM downloads WHERE user_id = ?";
      const [rows] = await connection.query(query, [user_id]);
      return rows;
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = Download;
