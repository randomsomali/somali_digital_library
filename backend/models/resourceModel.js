import db from "../config/db.js";

class Resource {
  static async findAll(filters = {}) {
    // Ensure pagination parameters with defaults and limits
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        r.id,
        r.title,
        r.doi,
        GROUP_CONCAT(a.name) as authors,
        r.publication_date,
        r.abstract,
        r.type,
        r.language,
        r.paid,
        r.status,
        r.file_public_id,
        c.id as category_id,
        c.name as category_name
      FROM resources r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN resource_authors ra ON r.id = ra.resource_id
      LEFT JOIN authors a ON ra.author_id = a.author_id
      WHERE r.status = 'published'
    `;
    const params = [];

    // Add filter conditions
    if (filters.search) {
      sql += ` AND (r.title LIKE ? OR r.abstract LIKE ? OR a.name LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.type && filters.type !== "all") {
      sql += " AND r.type = ?";
      params.push(filters.type);
    }

    if (filters.category_id && filters.category_id !== "all") {
      sql += " AND r.category_id = ?";
      params.push(filters.category_id);
    }

    if (filters.language && filters.language !== "all") {
      sql += " AND r.language = ?";
      params.push(filters.language);
    }

    if (filters.year && filters.year !== "all") {
      sql += " AND YEAR(r.publication_date) = ?";
      params.push(filters.year);
    }

    // Get total count with same filters but before pagination
    const countSql = `SELECT COUNT(DISTINCT r.id) as total FROM resources r 
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN resource_authors ra ON r.id = ra.resource_id
      LEFT JOIN authors a ON ra.author_id = a.author_id
      WHERE r.status = 'published'
      ${sql.split("WHERE r.status = 'published'")[1] || ""}`;

    const [countResult] = await db.query(countSql, params);
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    // Add grouping, ordering and pagination
    sql += " GROUP BY r.id ORDER BY r.publication_date DESC";
    const offset = (page - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const resources = await db.query(sql, params);

    return {
      resources: resources.map((resource) => ({
        ...resource,
        authors: resource.authors ? resource.authors.split(",") : [],
      })),
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findById(id) {
    const sql = `
      SELECT 
        r.id,
        r.title,
        r.doi,
        GROUP_CONCAT(a.name) as authors,
        r.publication_date,
        r.abstract,
        r.type,
        r.language,
        r.paid,
        r.status,
        r.file_public_id,
        c.id as category_id,
        c.name as category_name,
        COUNT(d.download_id) as downloads
      FROM resources r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN resource_authors ra ON r.id = ra.resource_id
      LEFT JOIN authors a ON ra.author_id = a.author_id
      LEFT JOIN downloads d ON r.id = d.resource_id
      WHERE r.id = ? AND r.status = 'published'
      GROUP BY r.id
    `;

    const [resource] = await db.query(sql, [id]);
    if (!resource) return null;

    return {
      ...resource,
      authors: resource.authors ? resource.authors.split(",") : [],
      downloads: parseInt(resource.downloads) || 0,
    };
  }

  static async create(data) {
    return db.transaction(async (conn) => {
      try {
        // Insert resource
        const resourceSql = `
          INSERT INTO resources (
            title, doi, publication_date, abstract,
            type, language, paid, status, file_public_id,
            category_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [resourceResult] = await conn.query(resourceSql, [
          data.title,
          data.doi || null,
          data.publication_date || null,
          data.abstract,
          data.type,
          data.language,
          data.paid || "free",
          data.status || "unpublished",
          data.file_public_id,
          data.category_id,
        ]);

        const resourceId = resourceResult.insertId;

        // Insert author associations
        if (data.author_ids && data.author_ids.length > 0) {
          const authorValues = data.author_ids.map((authorId) => [
            resourceId,
            authorId,
          ]);
          const authorSql = `
            INSERT INTO resource_authors (resource_id, author_id)
            VALUES ?
          `;
          await conn.query(authorSql, [authorValues]);
        }

        // Use the same transaction connection to fetch the resource
        const fetchSql = `
          SELECT 
            r.*,
            c.name as category_name,
            GROUP_CONCAT(DISTINCT a.author_id) as author_ids,
            GROUP_CONCAT(DISTINCT a.name) as author_names
          FROM resources r
          LEFT JOIN categories c ON r.category_id = c.id
          LEFT JOIN resource_authors ra ON r.id = ra.resource_id
          LEFT JOIN authors a ON ra.author_id = a.author_id
          WHERE r.id = ?
          GROUP BY r.id
        `;

        const [resource] = await conn.query(fetchSql, [resourceId]);

        if (!resource) {
          throw new Error("Resource created but not found");
        }

        // Format the result
        const result = {
          ...resource,
          author_ids: resource.author_ids
            ? resource.author_ids.split(",").map(Number)
            : [],
          author_names: resource.author_names
            ? resource.author_names.split(",")
            : [],
        };

        return result;
      } catch (error) {
        console.error("Error in create resource:", error);
        throw error;
      }
    });
  }

  static async update(id, data) {
    return db.transaction(async (conn) => {
      try {
        // Update resource
        const resourceSql = `
          UPDATE resources 
          SET 
            title = COALESCE(?, title),
            doi = COALESCE(?, doi),
            publication_date = COALESCE(?, publication_date),
            abstract = COALESCE(?, abstract),
            type = COALESCE(?, type),
            language = COALESCE(?, language),
            paid = COALESCE(?, paid),
            status = COALESCE(?, status),
            file_public_id = COALESCE(?, file_public_id),
            category_id = COALESCE(?, category_id),
            updated_at = NOW()
          WHERE id = ?
        `;

        await conn.query(resourceSql, [
          data.title,
          data.doi,
          data.publication_date,
          data.abstract,
          data.type,
          data.language,
          data.paid,
          data.status,
          data.file_public_id,
          data.category_id,
          id,
        ]);

        // Update author associations if provided
        if (data.author_ids) {
          // Delete existing associations
          await conn.query(
            "DELETE FROM resource_authors WHERE resource_id = ?",
            [id]
          );

          // Insert new associations
          if (data.author_ids.length > 0) {
            const authorValues = data.author_ids.map((authorId) => [
              id,
              authorId,
            ]);
            const authorSql = `
              INSERT INTO resource_authors (resource_id, author_id)
              VALUES ?
            `;
            await conn.query(authorSql, [authorValues]);
          }
        }

        // Fetch updated resource within the same transaction
        const fetchSql = `
          SELECT 
            r.*,
            c.name as category_name,
            GROUP_CONCAT(DISTINCT a.author_id) as author_ids,
            GROUP_CONCAT(DISTINCT a.name) as author_names
          FROM resources r
          LEFT JOIN categories c ON r.category_id = c.id
          LEFT JOIN resource_authors ra ON r.id = ra.resource_id
          LEFT JOIN authors a ON ra.author_id = a.author_id
          WHERE r.id = ?
          GROUP BY r.id
        `;

        const [resource] = await conn.query(fetchSql, [id]);

        if (!resource) {
          throw new Error("Resource not found after update");
        }

        // Format the result
        return {
          ...resource,
          author_ids: resource.author_ids
            ? resource.author_ids.split(",").map(Number)
            : [],
          author_names: resource.author_names
            ? resource.author_names.split(",")
            : [],
        };
      } catch (error) {
        console.error("Error in update resource:", error);
        throw error;
      }
    });
  }

  static async updateStatus(id, status) {
    const sql = "UPDATE resources SET status = ? WHERE id = ?";
    await db.query(sql, [status, id]);
    return this.findById(id);
  }

  static async updatePaidStatus(id, paid) {
    const sql = "UPDATE resources SET paid = ? WHERE id = ?";
    await db.query(sql, [paid, id]);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = "DELETE FROM resources WHERE id = ?";
    await db.query(sql, [id]);
  }

  static async findAllForAdmin(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(filters.limit) || 15));

    let sql = `
      SELECT 
        r.id,
        r.title,
        r.doi,
        GROUP_CONCAT(a.name) as authors,
        r.publication_date,
        r.abstract,
        r.type,
        r.language,
        r.paid,
        r.status,
        r.file_public_id,
        c.id as category_id,
        c.name as category_name,
        COUNT(DISTINCT d.download_id) as downloads
      FROM resources r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN resource_authors ra ON r.id = ra.resource_id
      LEFT JOIN authors a ON ra.author_id = a.author_id
      LEFT JOIN downloads d ON r.id = d.resource_id
    `;

    const params = [];
    const whereConditions = [];

    // Add filter conditions
    if (filters.search) {
      whereConditions.push(
        "(r.title LIKE ? OR r.abstract LIKE ? OR a.name LIKE ?)"
      );
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.type && filters.type !== "all") {
      whereConditions.push("r.type = ?");
      params.push(filters.type);
    }

    if (filters.category_id && filters.category_id !== "all") {
      whereConditions.push("r.category_id = ?");
      params.push(filters.category_id);
    }

    if (filters.language && filters.language !== "all") {
      whereConditions.push("r.language = ?");
      params.push(filters.language);
    }

    if (filters.year && filters.year !== "all") {
      whereConditions.push("YEAR(r.publication_date) = ?");
      params.push(filters.year);
    }

    if (filters.status && filters.status !== "all") {
      whereConditions.push("r.status = ?");
      params.push(filters.status);
    }

    if (filters.paid && filters.paid !== "all") {
      whereConditions.push("r.paid = ?");
      params.push(filters.paid);
    }

    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(" AND ")}`;
    }

    // Get total count before pagination
    const countSql = `SELECT COUNT(DISTINCT r.id) as total FROM resources r 
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN resource_authors ra ON r.id = ra.resource_id
      LEFT JOIN authors a ON ra.author_id = a.author_id
      ${
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : ""
      }`;

    const [countResult] = await db.query(countSql, params);
    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / limit);

    // Add grouping, ordering and pagination
    sql += " GROUP BY r.id ORDER BY r.publication_date DESC";
    const offset = (page - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const resources = await db.query(sql, params);

    return {
      resources: resources.map((resource) => ({
        ...resource,
        authors: resource.authors ? resource.authors.split(",") : [],
        downloads: parseInt(resource.downloads) || 0,
      })),
      total,
      totalPages,
      page,
      limit,
    };
  }

  static async findByIdForAdmin(id) {
    const sql = `
      SELECT 
        r.*,
        c.name as category_name,
        GROUP_CONCAT(DISTINCT a.author_id) as author_ids,
        GROUP_CONCAT(DISTINCT a.name) as author_names
      FROM resources r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN resource_authors ra ON r.id = ra.resource_id
      LEFT JOIN authors a ON ra.author_id = a.author_id
      WHERE r.id = ?
      GROUP BY r.id
    `;

    const [resource] = await db.query(sql, [id]);
    if (!resource) return null;

    return {
      ...resource,
      author_ids: resource.author_ids
        ? resource.author_ids.split(",").map(Number)
        : [],
      author_names: resource.author_names
        ? resource.author_names.split(",")
        : [],
    };
  }

  // New method to log download
  static async logDownload(userId, resourceId) {
    const sql = `
      INSERT INTO downloads (user_id, resource_id, downloaded_at)
      VALUES (?, ?, NOW())
    `;
    await db.query(sql, [userId, resourceId]);
  }

  // New method to check user subscription status
  static async checkUserSubscription(userId) {
    const sql = `
      SELECT us.status, us.expiry_date, s.name as subscription_name
      FROM user_subscriptions us
      JOIN subscriptions s ON us.subscription_id = s.subscription_id
      WHERE us.user_id = ? AND us.status = 'active'
      ORDER BY us.expiry_date DESC
      LIMIT 1
    `;
    const [subscription] = await db.query(sql, [userId]);
    return subscription;
  }

  // New method to check institution subscription status
  static async checkInstitutionSubscription(institutionId) {
    const sql = `
      SELECT us.status, us.expiry_date, s.name as subscription_name
      FROM user_subscriptions us
      JOIN subscriptions s ON us.subscription_id = s.subscription_id
      WHERE us.institution_id = ? AND us.status = 'active'
      ORDER BY us.expiry_date DESC
      LIMIT 1
    `;
    const [subscription] = await db.query(sql, [institutionId]);
    return subscription;
  }

  // New method to get user's institution
  static async getUserInstitution(userId) {
    const sql = `
      SELECT institution_id, role
      FROM users
      WHERE user_id = ?
    `;
    const [user] = await db.query(sql, [userId]);
    return user;
  }
}

export default Resource;
