import db from "../config/db.js";

class Institution {
  static async findByEmail(email, selectPassword = true) {
    const fields = selectPassword
      ? "institution_id, name, email, password, sub_status, created_at"
      : "institution_id, name, email, sub_status, created_at";

    const sql = `SELECT ${fields} FROM institutions WHERE email = ?`;
    const institutions = await db.query(sql, [email]);
    return institutions[0];
  }

  static async findById(id, selectPassword = false) {
    const fields = selectPassword
      ? "institution_id, name, email, password, sub_status, created_at"
      : "institution_id, name, email, sub_status, created_at";

    const sql = `SELECT ${fields} FROM institutions WHERE institution_id = ?`;
    const institutions = await db.query(sql, [id]);
    return institutions[0];
  }

  // Admin CRUD operations
  static async findAllForAdmin(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        i.institution_id,
        i.name,
        i.email,
        i.sub_status,
        i.created_at,
        COUNT(DISTINCT u.user_id) as user_count,
        MAX(s.name) as subscription_name,
        MAX(us.expiry_date) as expiry_date
      FROM institutions i
      LEFT JOIN users u ON i.institution_id = u.institution_id
      LEFT JOIN user_subscriptions us ON i.institution_id = us.institution_id AND us.status = 'active'
      LEFT JOIN subscriptions s ON us.subscription_id = s.subscription_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.search) {
      sql += ` AND (i.name LIKE ? OR i.email LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.sub_status && filters.sub_status !== "all") {
      sql += ` AND i.sub_status = ?`;
      params.push(filters.sub_status);
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(DISTINCT i.institution_id) as total FROM institutions i ${
      sql.split("FROM institutions i")[1].split("GROUP BY")[0] || ""
    }`;

    const [countResult] = await db.query(countSql, params);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    sql += ` GROUP BY i.institution_id ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const institutions = await db.query(sql, params);

    return {
      institutions,
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findByIdForAdmin(id) {
    const sql = `
      SELECT 
        i.institution_id,
        i.name,
        i.email,
        i.sub_status,
        i.created_at,
        COUNT(DISTINCT u.user_id) as user_count,
        MAX(s.name) as subscription_name,
        MAX(us.expiry_date) as expiry_date
      FROM institutions i
      LEFT JOIN users u ON i.institution_id = u.institution_id
      LEFT JOIN user_subscriptions us ON i.institution_id = us.institution_id AND us.status = 'active'
      LEFT JOIN subscriptions s ON us.subscription_id = s.subscription_id
      WHERE i.institution_id = ?
      GROUP BY i.institution_id
    `;

    const [institution] = await db.query(sql, [id]);
    return institution;
  }

  static async create(data) {
    // Validate name length in database
    if (data.name.length > 255) {
      throw new Error("Name cannot exceed 255 characters");
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
      INSERT INTO institutions (
        name, email, password, sub_status
      ) VALUES (?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      data.name,
      data.email,
      data.password,
      data.sub_status || "none",
    ]);

    return this.findByIdForAdmin(result.insertId);
  }

  static async update(id, data) {
    // Validate name length if provided
    if (data.name && data.name.length > 255) {
      throw new Error("Name cannot exceed 255 characters");
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
      params.push(data.password); // Should be hashed before update
    }

    if (data.sub_status !== undefined) {
      updateFields.push("sub_status = ?");
      params.push(data.sub_status);
    }

    if (updateFields.length === 0) return this.findByIdForAdmin(id);

    params.push(id);

    const sql = `
      UPDATE institutions 
      SET ${updateFields.join(", ")}
      WHERE institution_id = ?
    `;

    await db.query(sql, params);
    return this.findByIdForAdmin(id);
  }

  static async delete(id) {
    const sql = `DELETE FROM institutions WHERE institution_id = ?`;
    await db.query(sql, [id]);
  }

  static async checkEmailExists(email, excludeId = null) {
    const sql =
      "SELECT institution_id FROM institutions WHERE email = ? AND institution_id != ?";
    const result = await db.query(sql, [email, excludeId || 0]);
    return result.length > 0;
  }
}

export default Institution;
