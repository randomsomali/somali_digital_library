import db from "../config/db.js";

class User {
  static async findByEmail(email, selectPassword = true) {
    const fields = selectPassword
      ? "user_id, email, password, name, role, institution_id, sub_status, created_at"
      : "user_id, email, name, role, institution_id, sub_status, created_at";

    const sql = `SELECT ${fields} FROM users WHERE email = ?`;
    const users = await db.query(sql, [email]);
    return users[0];
  }

  static async findById(id, selectPassword = false) {
    const fields = selectPassword
      ? "user_id, email, password, name, role, institution_id, sub_status, created_at"
      : "user_id, email, name, role, institution_id, sub_status, created_at";

    const sql = `SELECT ${fields} FROM users WHERE user_id = ?`;
    const users = await db.query(sql, [id]);
    return users[0];
  }

  // Admin CRUD operations
  static async findAllForAdmin(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.role,
        u.sub_status,
        u.created_at,
        i.name as institution_name
      FROM users u
      LEFT JOIN institutions i ON u.institution_id = i.institution_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.search) {
      sql += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.role && filters.role !== "all") {
      sql += ` AND u.role = ?`;
      params.push(filters.role);
    }

    if (filters.sub_status && filters.sub_status !== "all") {
      sql += ` AND u.sub_status = ?`;
      params.push(filters.sub_status);
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(*) as total FROM users u WHERE 1=1 ${
      sql.split("WHERE 1=1")[1] || ""
    }`;

    const [countResult] = await db.query(countSql, params);
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    sql += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const users = await db.query(sql, params);

    return {
      users,
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findByIdForAdmin(id) {
    const sql = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.role,
        u.sub_status,
        u.created_at,
        i.institution_id,
        i.name as institution_name
      FROM users u
      LEFT JOIN institutions i ON u.institution_id = i.institution_id
      WHERE u.user_id = ?
    `;

    const [user] = await db.query(sql, [id]);
    return user || null;
  }

  static async create(data) {
    const sql = `
      INSERT INTO users (
        name, email, password, role,
        institution_id, sub_status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      data.name,
      data.email,
      data.password,
      data.role,
      data.institution_id || null,
      data.sub_status || "none",
    ]);

    return result.insertId;
  }

  static async update(id, data) {
    const updateFields = [];
    const params = [];

    if (data.name !== undefined) {
      updateFields.push("name = ?");
      params.push(data.name);
    }

    if (data.email !== undefined) {
      updateFields.push("email = ?");
      params.push(data.email);
    }

    if (data.password !== undefined) {
      updateFields.push("password = ?");
      params.push(data.password);
    }

    if (data.role !== undefined) {
      updateFields.push("role = ?");
      params.push(data.role);
    }

    if (data.institution_id !== undefined) {
      updateFields.push("institution_id = ?");
      params.push(data.institution_id);
    }

    if (data.sub_status !== undefined) {
      updateFields.push("sub_status = ?");
      params.push(data.sub_status);
    }

    if (updateFields.length === 0) return this.findByIdForAdmin(id);

    params.push(id);

    const sql = `
      UPDATE users 
      SET ${updateFields.join(", ")}
      WHERE user_id = ?
    `;

    await db.query(sql, params);
    return this.findByIdForAdmin(id);
  }

  static async delete(id) {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    await db.query(sql, [id]);
  }
}

export default User;
