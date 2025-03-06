import db from "../config/db.js";

class Category {
  static async findAll() {
    const sql = `
      SELECT 
        c.id,
        c.name,
        COUNT(r.id) as resource_count
      FROM categories c
      LEFT JOIN resources r ON c.id = r.category_id AND r.status = 'published'
      GROUP BY c.id
      ORDER BY c.name ASC
    `;

    const categories = await db.query(sql);
    return categories;
  }

  // Admin CRUD operations
  static async findAllForAdmin(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        c.id,
        c.name,
        COUNT(r.id) as resource_count,
        c.created_at,
        c.updated_at
      FROM categories c
      LEFT JOIN resources r ON c.id = r.category_id
    `;

    const params = [];

    if (filters.search) {
      sql += ` WHERE c.name LIKE ?`;
      params.push(`%${filters.search}%`);
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(*) as total FROM categories c ${
      filters.search ? "WHERE c.name LIKE ?" : ""
    }`;

    const [countResult] = await db.query(
      countSql,
      filters.search ? [`%${filters.search}%`] : []
    );
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    sql += ` GROUP BY c.id ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const categories = await db.query(sql, params);

    return {
      categories,
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findByIdForAdmin(id) {
    const sql = `
      SELECT 
        c.id,
        c.name,
        COUNT(r.id) as resource_count,
        c.created_at,
        c.updated_at
      FROM categories c
      LEFT JOIN resources r ON c.id = r.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `;

    const [category] = await db.query(sql, [id]);
    return category || null;
  }

  static async create(data) {
    const sql = `INSERT INTO categories (name) VALUES (?)`;
    const result = await db.query(sql, [data.name]);
    return result.insertId;
  }

  static async update(id, data) {
    const sql = `UPDATE categories SET name = ? WHERE id = ?`;
    await db.query(sql, [data.name, id]);
    return this.findByIdForAdmin(id);
  }

  static async delete(id) {
    const sql = `DELETE FROM categories WHERE id = ?`;
    await db.query(sql, [id]);
  }
}

export default Category;
