import db from "../config/db.js";

class UserSubscription {
  static async findAllForAdmin(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        us.user_sub_id,
        us.user_id,
        us.institution_id,
        us.subscription_id,
        us.price,
        us.start_date,
        us.expiry_date,
        us.payment_method,
        us.status,
        us.confirmed_by,
        us.created_at,
        s.name as subscription_name,
        s.type as subscription_type,
        s.duration_days,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        i.name as institution_name,
        i.email as institution_email,
        a.fullname as confirmed_by_name
      FROM user_subscriptions us
      LEFT JOIN subscriptions s ON us.subscription_id = s.subscription_id
      LEFT JOIN users u ON us.user_id = u.user_id
      LEFT JOIN institutions i ON us.institution_id = i.institution_id
      LEFT JOIN admins a ON us.confirmed_by = a.admin_id
    `;

    const params = [];
    const whereConditions = [];

    if (filters.search) {
      whereConditions.push(
        `(u.name LIKE ? OR u.email LIKE ? OR i.name LIKE ? OR i.email LIKE ? OR s.name LIKE ?)`
      );
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.status && filters.status !== "all") {
      whereConditions.push(`us.status = ?`);
      params.push(filters.status);
    }

    if (filters.type && filters.type !== "all") {
      whereConditions.push(`s.type = ?`);
      params.push(filters.type);
    }

    if (filters.payment_method && filters.payment_method !== "all") {
      whereConditions.push(`us.payment_method = ?`);
      params.push(filters.payment_method);
    }

    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(" AND ")}`;
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(*) as total FROM user_subscriptions us
      LEFT JOIN subscriptions s ON us.subscription_id = s.subscription_id
      LEFT JOIN users u ON us.user_id = u.user_id
      LEFT JOIN institutions i ON us.institution_id = i.institution_id
      ${
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : ""
      }`;

    const [countResult] = await db.query(countSql, params);
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    sql += ` ORDER BY us.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const userSubscriptions = await db.query(sql, params);

    return {
      userSubscriptions,
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findByIdForAdmin(id) {
    const sql = `
      SELECT 
        us.user_sub_id,
        us.user_id,
        us.institution_id,
        us.subscription_id,
        us.price,
        us.start_date,
        us.expiry_date,
        us.payment_method,
        us.status,
        us.confirmed_by,
        us.created_at,
        s.name as subscription_name,
        s.type as subscription_type,
        s.duration_days,
        s.features,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        i.name as institution_name,
        i.email as institution_email,
        a.fullname as confirmed_by_name
      FROM user_subscriptions us
      LEFT JOIN subscriptions s ON us.subscription_id = s.subscription_id
      LEFT JOIN users u ON us.user_id = u.user_id
      LEFT JOIN institutions i ON us.institution_id = i.institution_id
      LEFT JOIN admins a ON us.confirmed_by = a.admin_id
      WHERE us.user_sub_id = ?
    `;

    const [userSubscription] = await db.query(sql, [id]);
    if (!userSubscription) return null;

    // Parse features
    try {
      userSubscription.features = userSubscription.features
        ? JSON.parse(userSubscription.features)
        : [];
    } catch (error) {
      console.error("Error parsing features:", error);
      userSubscription.features = [];
    }

    return userSubscription;
  }

  static async create(data) {
    // Validate subscription exists
    const subscriptionSql = `SELECT * FROM subscriptions WHERE subscription_id = ?`;
    const [subscription] = await db.query(subscriptionSql, [
      data.subscription_id,
    ]);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Validate user or institution exists
    if (data.user_id) {
      const userSql = `SELECT * FROM users WHERE user_id = ?`;
      const [user] = await db.query(userSql, [data.user_id]);
      if (!user) {
        throw new Error("User not found");
      }
      // Check if user role is 'user' for user type subscriptions
      if (subscription.type === "user" && user.role !== "user") {
        throw new Error(
          "Only users with role 'user' can subscribe to user subscriptions"
        );
      }

      // Check for existing active subscription for this user
      const existingUserSubSql = `
        SELECT COUNT(*) as count FROM user_subscriptions 
        WHERE user_id = ? AND status = 'active'
      `;
      const [existingUserSub] = await db.query(existingUserSubSql, [
        data.user_id,
      ]);
      if (existingUserSub.count > 0) {
        throw new Error("User already has an active subscription");
      }
    }

    if (data.institution_id) {
      const institutionSql = `SELECT * FROM institutions WHERE institution_id = ?`;
      const [institution] = await db.query(institutionSql, [
        data.institution_id,
      ]);
      if (!institution) {
        throw new Error("Institution not found");
      }
      // Check if subscription type matches
      if (subscription.type !== "institution") {
        throw new Error(
          "Institution can only subscribe to institution type subscriptions"
        );
      }

      // Check for existing active subscription for this institution
      const existingInstSubSql = `
        SELECT COUNT(*) as count FROM user_subscriptions 
        WHERE institution_id = ? AND status = 'active'
      `;
      const [existingInstSub] = await db.query(existingInstSubSql, [
        data.institution_id,
      ]);
      if (existingInstSub.count > 0) {
        throw new Error("Institution already has an active subscription");
      }
    }

    // Calculate expiry date
    const startDate = data.start_date ? new Date(data.start_date) : new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + subscription.duration_days);

    const sql = `
      INSERT INTO user_subscriptions (
        user_id, institution_id, subscription_id, price, 
        start_date, expiry_date, payment_method, status, confirmed_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      data.user_id || null,
      data.institution_id || null,
      data.subscription_id,
      data.price || subscription.price,
      startDate.toISOString().split("T")[0],
      expiryDate.toISOString().split("T")[0],
      data.payment_method || "manual",
      data.status || "pending",
      data.confirmed_by || null,
    ]);

    // Update user/institution sub_status if subscription is active
    if (data.status === "active") {
      if (data.user_id) {
        await db.query(
          `UPDATE users SET sub_status = 'active' WHERE user_id = ?`,
          [data.user_id]
        );
      }
      if (data.institution_id) {
        await db.query(
          `UPDATE institutions SET sub_status = 'active' WHERE institution_id = ?`,
          [data.institution_id]
        );
        // Update users with the same institution_id to active
        await db.query(
          `UPDATE users SET sub_status = 'active' WHERE institution_id = ?`,
          [data.institution_id]
        );
      }
    }

    return this.findByIdForAdmin(result.insertId);
  }

  static async update(id, data) {
    const userSubscription = await this.findByIdForAdmin(id);
    if (!userSubscription) {
      throw new Error("User subscription not found");
    }

    // If status is being changed to active, check for existing active subscriptions
    if (data.status === "active") {
      if (userSubscription.user_id) {
        const existingUserSubSql = `
          SELECT COUNT(*) as count FROM user_subscriptions 
          WHERE user_id = ? AND status = 'active' AND user_sub_id != ?
        `;
        const [existingUserSub] = await db.query(existingUserSubSql, [
          userSubscription.user_id,
          id,
        ]);
        if (existingUserSub.count > 0) {
          throw new Error("User already has an active subscription");
        }
      }

      if (userSubscription.institution_id) {
        const existingInstSubSql = `
          SELECT COUNT(*) as count FROM user_subscriptions 
          WHERE institution_id = ? AND status = 'active' AND user_sub_id != ?
        `;
        const [existingInstSub] = await db.query(existingInstSubSql, [
          userSubscription.institution_id,
          id,
        ]);
        if (existingInstSub.count > 0) {
          throw new Error("Institution already has an active subscription");
        }
      }
    }

    const updateFields = [];
    const params = [];

    if (data.price !== undefined) {
      updateFields.push("price = ?");
      params.push(data.price);
    }

    if (data.start_date !== undefined) {
      updateFields.push("start_date = ?");
      params.push(data.start_date);
    }

    if (data.expiry_date !== undefined) {
      updateFields.push("expiry_date = ?");
      params.push(data.expiry_date);
    }

    if (data.payment_method !== undefined) {
      updateFields.push("payment_method = ?");
      params.push(data.payment_method);
    }

    if (data.status !== undefined) {
      updateFields.push("status = ?");
      params.push(data.status);
    }

    if (data.confirmed_by !== undefined) {
      updateFields.push("confirmed_by = ?");
      params.push(data.confirmed_by);
    }

    if (updateFields.length === 0) return userSubscription;

    params.push(id);

    const sql = `
      UPDATE user_subscriptions 
      SET ${updateFields.join(", ")}
      WHERE user_sub_id = ?
    `;

    await db.query(sql, params);
    // Update user/institution sub_status based on new status pending or expired or active
    if (data.status !== undefined) {
      if (userSubscription.user_id) {
        await db.query(`UPDATE users SET sub_status = ? WHERE user_id = ?`, [
          data.status === "active"
            ? "active"
            : data.status === "pending"
            ? "none"
            : "expired",
          userSubscription.user_id,
        ]);
      }
      if (userSubscription.institution_id) {
        await db.query(
          `UPDATE institutions SET sub_status = ? WHERE institution_id = ?`,
          [
            data.status === "active"
              ? "active"
              : data.status === "pending"
              ? "none"
              : "expired",
            userSubscription.institution_id,
          ]
        );

        // Update institution users when status changes
        if (data.status === "active") {
          await db.query(
            `UPDATE users SET sub_status = 'active' WHERE institution_id = ?`,
            [userSubscription.institution_id]
          );
        } else {
          // Check if institution has other active subscriptions
          const otherActiveSubsSql = `
            SELECT COUNT(*) as count FROM user_subscriptions 
            WHERE institution_id = ? AND status = 'active' AND user_sub_id != ?
          `;
          const [otherActiveSubs] = await db.query(otherActiveSubsSql, [
            userSubscription.institution_id,
            id,
          ]);

          if (otherActiveSubs.count === 0) {
            await db.query(
              `UPDATE users SET sub_status = 'expired' WHERE institution_id = ?`,
              [userSubscription.institution_id]
            );
          }
        }
      }
    }

    return this.findByIdForAdmin(id);
  }

  static async delete(id) {
    const userSubscription = await this.findByIdForAdmin(id);
    if (!userSubscription) {
      throw new Error("User subscription not found");
    }

    const sql = `DELETE FROM user_subscriptions WHERE user_sub_id = ?`;
    await db.query(sql, [id]);

    // Update user/institution sub_status to 'none' if this was their only active subscription
    if (userSubscription.user_id) {
      const activeSubsSql = `
        SELECT COUNT(*) as count FROM user_subscriptions 
        WHERE user_id = ? AND status = 'active' AND user_sub_id != ?
      `;
      const [activeSubs] = await db.query(activeSubsSql, [
        userSubscription.user_id,
        id,
      ]);
      if (activeSubs.count === 0) {
        await db.query(
          `UPDATE users SET sub_status = 'none' WHERE user_id = ?`,
          [userSubscription.user_id]
        );
      }
    }

    if (userSubscription.institution_id) {
      const activeSubsSql = `
        SELECT COUNT(*) as count FROM user_subscriptions 
        WHERE institution_id = ? AND status = 'active' AND user_sub_id != ?
      `;
      const [activeSubs] = await db.query(activeSubsSql, [
        userSubscription.institution_id,
        id,
      ]);
      if (activeSubs.count === 0) {
        await db.query(
          `UPDATE institutions SET sub_status = 'none' WHERE institution_id = ?`,
          [userSubscription.institution_id]
        );
      }
    }
  }

  // Get all subscriptions for dropdown
  static async getAllSubscriptions() {
    const sql = `
      SELECT subscription_id, name, type, price, duration_days
      FROM subscriptions
      ORDER BY name ASC
    `;
    return await db.query(sql);
  }

  // Get users for dropdown (only users with role 'user')
  static async getUsersForDropdown() {
    const sql = `
      SELECT user_id, name, email, role
      FROM users
      WHERE role = 'user'
      ORDER BY name ASC
    `;
    return await db.query(sql);
  }

  // Get institutions for dropdown
  static async getInstitutionsForDropdown() {
    const sql = `
      SELECT institution_id, name, email
      FROM institutions
      ORDER BY name ASC
    `;
    return await db.query(sql);
  }

  // Check if user/institution already has an active subscription
  static async checkActiveSubscription(userId = null, institutionId = null) {
    let sql = `
      SELECT COUNT(*) as count FROM user_subscriptions 
      WHERE status = 'active'
    `;
    const params = [];

    if (userId) {
      sql += ` AND user_id = ?`;
      params.push(userId);
    }

    if (institutionId) {
      sql += ` AND institution_id = ?`;
      params.push(institutionId);
    }

    const [result] = await db.query(sql, params);
    return result.count > 0;
  }

  static async hasActiveSubscriptionForUser(userId) {
    const sql = `SELECT COUNT(*) as count FROM user_subscriptions WHERE user_id = ? AND status = 'active'`;
    const [result] = await db.query(sql, [userId]);
    return result.count > 0;
  }

  static async hasActiveSubscriptionForInstitution(institutionId) {
    const sql = `SELECT COUNT(*) as count FROM user_subscriptions WHERE institution_id = ? AND status = 'active'`;
    const [result] = await db.query(sql, [institutionId]);
    return result.count > 0;
  }
}

export default UserSubscription;
