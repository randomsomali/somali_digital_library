import db from "../config/db.js";
import AuthService from "../services/authService.js";

class Admin {
  static async findByEmail(email, selectPassword = true) {
    const fields = selectPassword
      ? "admin_id, email, password, fullname, role, created_at"
      : "admin_id, email, fullname, role, created_at";

    const sql = `SELECT ${fields} FROM admins WHERE email = ?`;
    const admins = await db.query(sql, [email]);
    return admins[0];
  }

  static async findById(id, selectPassword = false) {
    const fields = selectPassword
      ? "admin_id, email, password, fullname, role, created_at"
      : "admin_id, email, fullname, role, created_at";

    const sql = `SELECT ${fields} FROM admins WHERE admin_id = ?`;
    const admins = await db.query(sql, [id]);
    return admins[0];
  }

  static async findAllForAdmin(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        admin_id,
        fullname,
        email,
        role,
        created_at
      FROM admins
      WHERE 1=1
    `;

    const params = [];

    if (filters.search) {
      sql += ` AND (fullname LIKE ? OR email LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.role && filters.role !== "all") {
      sql += ` AND role = ?`;
      params.push(filters.role);
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(*) as total FROM admins WHERE 1=1 ${
      sql.split("WHERE 1=1")[1] || ""
    }`;

    const [countResult] = await db.query(countSql, params);
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const admins = await db.query(sql, params);

    return {
      admins,
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findByIdForAdmin(id) {
    const sql = `
      SELECT 
        admin_id,
        fullname,
        email,
        role,
        created_at
      FROM admins
      WHERE admin_id = ?
    `;

    const [admin] = await db.query(sql, [id]);
    return admin || null;
  }

  static async create(data) {
    // Validate fullname length in database
    if (data.fullname.length > 50) {
      throw new Error("Full name cannot exceed 50 characters");
    }

    // Validate email length
    if (data.email.length > 100) {
      throw new Error("Email cannot exceed 100 characters");
    }

    // Validate password length if provided
    if (data.password && data.password.length > 100) {
      throw new Error("Password cannot exceed 100 characters");
    }

    const sql = `
      INSERT INTO admins (
        fullname, email, password, role
      ) VALUES (?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      data.fullname,
      data.email,
      data.password,
      data.role || "staff",
    ]);

    return result.insertId;
  }

  static async update(id, data) {
    // Validate fullname length if provided
    if (data.fullname && data.fullname.length > 50) {
      throw new Error("Full name cannot exceed 50 characters");
    }

    // Validate email length if provided
    if (data.email && data.email.length > 100) {
      throw new Error("Email cannot exceed 100 characters");
    }

    // Validate password length if provided
    if (data.password && data.password.length > 100) {
      throw new Error("Password cannot exceed 100 characters");
    }

    const updateFields = [];
    const params = [];

    if (data.fullname !== undefined) {
      updateFields.push("fullname = ?");
      params.push(data.fullname);
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

    if (updateFields.length === 0) return this.findByIdForAdmin(id);

    params.push(id);

    const sql = `
      UPDATE admins 
      SET ${updateFields.join(", ")}
      WHERE admin_id = ?
    `;

    await db.query(sql, params);
    return this.findByIdForAdmin(id);
  }

  static async delete(id) {
    const sql = `DELETE FROM admins WHERE admin_id = ?`;
    await db.query(sql, [id]);
  }

  static async checkEmailExists(email, excludeId = null) {
    const sql = "SELECT admin_id FROM admins WHERE email = ? AND admin_id != ?";
    const result = await db.query(sql, [email, excludeId || 0]);
    return result.length > 0;
  }
}

export default Admin;
