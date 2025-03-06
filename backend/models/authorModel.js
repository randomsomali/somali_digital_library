import db from "../config/db.js";

class Author {
  static async findAllForAdmin(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        a.author_id,
        a.name,
        COUNT(DISTINCT ra.resource_id) as resource_count,
        a.created_at
      FROM authors a
      LEFT JOIN resource_authors ra ON a.author_id = ra.author_id
    `;

    const params = [];

    if (filters.search) {
      sql += ` WHERE a.name LIKE ?`;
      params.push(`%${filters.search}%`);
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(*) as total FROM authors a ${
      filters.search ? "WHERE a.name LIKE ?" : ""
    }`;

    const [countResult] = await db.query(
      countSql,
      filters.search ? [`%${filters.search}%`] : []
    );
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    sql += ` GROUP BY a.author_id ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const authors = await db.query(sql, params);

    return {
      authors,
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findByIdForAdmin(id) {
    const sql = `
      SELECT 
        a.author_id,
        a.name,
        COUNT(DISTINCT ra.resource_id) as resource_count,
        a.created_at
      FROM authors a
      LEFT JOIN resource_authors ra ON a.author_id = ra.author_id
      WHERE a.author_id = ?
      GROUP BY a.author_id
    `;

    const [author] = await db.query(sql, [id]);
    return author || null;
  }

  static async create(data) {
    const sql = `INSERT INTO authors (name) VALUES (?)`;
    const result = await db.query(sql, [data.name]);
    return result.insertId;
  }

  static async update(id, data) {
    const sql = `UPDATE authors SET name = ? WHERE author_id = ?`;
    await db.query(sql, [data.name, id]);
    return this.findByIdForAdmin(id);
  }

  static async delete(id) {
    const sql = `DELETE FROM authors WHERE author_id = ?`;
    await db.query(sql, [id]);
  }
}

export default Author;
