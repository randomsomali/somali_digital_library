const pool = require("../config/db");

class Resource {
  static async createResource(data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        "INSERT INTO resources (title, author, abstract, year_of_publication, language, category_id, type, keywords, file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.title,
          data.author,
          data.abstract,
          data.year_of_publication,
          data.language,
          data.category_id,
          data.type,
          data.keywords,
          data.file_url,
        ]
      );
      await connection.commit();
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async getAllResources(filters) {
    const connection = await pool.getConnection();
    try {
      let query =
        "SELECT resources.*, categories.category_name FROM resources LEFT JOIN categories  ON resources.category_id = categories.category_id WHERE 1=1";
      const params = [];

      if (filters.category_id) {
        query += " AND category_id = ?";
        params.push(filters.category_id);
      }
      if (filters.type) {
        query += " AND type = ?";
        params.push(filters.type);
      }
      if (filters.year_of_publication) {
        query += " AND year_of_publication = ?";
        params.push(filters.year_of_publication);
      }

      const [rows] = await connection.query(query, params);
      return rows;
    } finally {
      connection.release();
    }
  }
  static async getAllResourcesnext(filters) {
    const connection = await pool.getConnection();
    try {
      let query =
        "SELECT resources.*, categories.category_name FROM resources LEFT JOIN categories ON resources.category_id = categories.category_id WHERE 1=1";
      const params = [];

      if (filters.category_id) {
        query += " AND category_id = ?";
        params.push(filters.category_id);
      }
      if (filters.type) {
        query += " AND type = ?";
        params.push(filters.type);
      }
      if (filters.year_of_publication) {
        query += " AND year_of_publication = ?";
        params.push(filters.year_of_publication);
      }
      if (filters.search) {
        query += " AND title LIKE ?"; // Assuming you want to search by title
        params.push(`%${filters.search}%`); // Use wildcard for partial matches
      }

      const [rows] = await connection.query(query, params);
      return rows;
    } finally {
      connection.release();
    }
  }
  static async getResourceById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT resources.*, categories.category_name FROM resources LEFT JOIN categories  ON resources.category_id = categories.category_id WHERE id = ?",
        [id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async updateResource(id, data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        "UPDATE resources SET title = ?, author = ?, abstract = ?, year_of_publication = ?, language = ?, category_id = ?, type = ?, keywords = ?, file_url = ? WHERE id = ?",
        [
          data.title,
          data.author,
          data.abstract,
          data.year_of_publication,
          data.language,
          data.category_id,
          data.type,
          data.keywords,
          data.file_url,
          id,
        ]
      );
      await connection.commit();
    } finally {
      connection.release();
    }
  }

  static async deleteResource(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query("DELETE FROM resources WHERE id = ?", [id]);
      await connection.commit();
    } finally {
      connection.release();
    }
  }
}

module.exports = Resource;
