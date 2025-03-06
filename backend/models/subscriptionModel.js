import db from "../config/db.js";

class Subscription {
  static async findAllForAdmin(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        s.subscription_id,
        s.name,
        s.type,
        s.price,
        s.duration_days,
        s.created_at,
        COUNT(DISTINCT CASE WHEN u.sub_status = 'active' THEN u.user_id END) as active_users,
        COUNT(DISTINCT CASE WHEN i.sub_status = 'active' THEN i.institution_id END) as active_institutions
      FROM subscriptions s
      LEFT JOIN users u ON s.type = 'user' AND u.sub_status = 'active'
      LEFT JOIN institutions i ON s.type = 'institution' AND i.sub_status = 'active'
    `;

    const params = [];

    if (filters.search) {
      sql += ` WHERE s.name LIKE ?`;
      params.push(`%${filters.search}%`);
    }

    if (filters.type && filters.type !== "all") {
      sql += `${filters.search ? " AND" : " WHERE"} s.type = ?`;
      params.push(filters.type);
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(*) as total FROM subscriptions s ${
      sql.split("FROM subscriptions s")[1].split("GROUP BY")[0] || ""
    }`;

    const [countResult] = await db.query(countSql, params);
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    sql += ` GROUP BY s.subscription_id ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const subscriptions = await db.query(sql, params);

    return {
      subscriptions,
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findByIdForAdmin(id) {
    const sql = `
      SELECT 
        s.subscription_id,
        s.name,
        s.type,
        s.price,
        s.duration_days,
        s.created_at,
        COUNT(DISTINCT CASE WHEN u.sub_status = 'active' THEN u.user_id END) as active_users,
        COUNT(DISTINCT CASE WHEN i.sub_status = 'active' THEN i.institution_id END) as active_institutions
      FROM subscriptions s
      LEFT JOIN users u ON s.type = 'user' AND u.sub_status = 'active'
      LEFT JOIN institutions i ON s.type = 'institution' AND i.sub_status = 'active'
      WHERE s.subscription_id = ?
      GROUP BY s.subscription_id
    `;

    const [subscription] = await db.query(sql, [id]);
    return subscription || null;
  }

  static async create(data) {
    const sql = `
      INSERT INTO subscriptions (
        name, type, price, duration_days
      ) VALUES (?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      data.name,
      data.type,
      data.price,
      data.duration_days,
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

    if (data.type !== undefined) {
      updateFields.push("type = ?");
      params.push(data.type);
    }

    if (data.price !== undefined) {
      updateFields.push("price = ?");
      params.push(data.price);
    }

    if (data.duration_days !== undefined) {
      updateFields.push("duration_days = ?");
      params.push(data.duration_days);
    }

    if (updateFields.length === 0) return this.findByIdForAdmin(id);

    params.push(id);

    const sql = `
      UPDATE subscriptions 
      SET ${updateFields.join(", ")}
      WHERE subscription_id = ?
    `;

    await db.query(sql, params);
    return this.findByIdForAdmin(id);
  }

  static async delete(id) {
    const sql = `DELETE FROM subscriptions WHERE subscription_id = ?`;
    await db.query(sql, [id]);
  }
}

export default Subscription;
