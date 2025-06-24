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
        u.institution_id,
        i.name as institution_name,
        GROUP_CONCAT(DISTINCT s.name) as subscription_names,
        GROUP_CONCAT(DISTINCT us.expiry_date) as expiry_dates
      FROM users u
      LEFT JOIN institutions i ON u.institution_id = i.institution_id
      LEFT JOIN user_subscriptions us ON u.user_id = us.user_id AND us.status = 'active'
      LEFT JOIN subscriptions s ON us.subscription_id = s.subscription_id
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

    // Add GROUP BY to prevent duplicates
    sql += ` GROUP BY u.user_id`;

    // Get total count
    const countSql = `
      SELECT COUNT(DISTINCT u.user_id) as total 
      FROM users u 
      WHERE 1=1 ${sql.split("WHERE 1=1")[1].split("GROUP BY")[0] || ""}
    `;

    const [countResult] = await db.query(countSql, params);
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    sql += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const users = await db.query(sql, params);

    // Process the results to format subscription data
    const processedUsers = users.map(user => ({
      ...user,
      subscription_name: user.subscription_names ? user.subscription_names.split(',')[0] : null,
      expiry_date: user.expiry_dates ? user.expiry_dates.split(',')[0] : null,
      // Remove the concatenated fields
      subscription_names: undefined,
      expiry_dates: undefined
    }));

    return {
      users: processedUsers,
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
        u.institution_id,
        i.name as institution_name
      FROM users u
      LEFT JOIN institutions i ON u.institution_id = i.institution_id
      WHERE u.user_id = ?
    `;

    const [user] = await db.query(sql, [id]);
    return user || null;
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

  static async findAllStudentsByInstitution(institutionId, filters = {}) {
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
        i.name as institution_name,
        GROUP_CONCAT(DISTINCT s.name) as subscription_names,
        GROUP_CONCAT(DISTINCT us.expiry_date) as expiry_dates
      FROM users u
      LEFT JOIN institutions i ON u.institution_id = i.institution_id
      LEFT JOIN user_subscriptions us ON u.user_id = us.user_id AND us.status = 'active'
      LEFT JOIN subscriptions s ON us.subscription_id = s.subscription_id
      WHERE u.institution_id = ? AND u.role = 'student'
    `;

    const params = [institutionId];

    if (filters.search) {
      sql += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.sub_status && filters.sub_status !== "all") {
      sql += ` AND u.sub_status = ?`;
      params.push(filters.sub_status);
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as subquery`;
    const [countResult] = await db.query(countSql, params);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // Add GROUP BY before ORDER BY
    sql += ` GROUP BY u.user_id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;

    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const users = await db.query(sql, params);

    // Process the results
    const processedUsers = users.map(user => ({
      ...user,
      subscription_name: user.subscription_names ? user.subscription_names.split(',')[0] : null,
      expiry_date: user.expiry_dates ? user.expiry_dates.split(',')[0] : null,
      subscription_names: undefined,
      expiry_dates: undefined
    }));

    return {
      users: processedUsers,
      total,
      totalPages,
      page,
      limit,
    };
  }
}

export default User;
