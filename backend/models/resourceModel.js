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
        r.file_url,
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
        r.file_url,
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
    const sql = `
      INSERT INTO resources (
        title, doi, publication_date, abstract,
        type, language, paid, status, file_url, file_public_id, category_id
      ) VALUES (?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.title,
      data.doi,
      // JSON.stringify(data.authors),
      data.publication_date,
      data.abstract,
      data.type,
      data.language,
      data.paid || "free",
      data.status || "unpublished",
      data.file_url,
      data.file_public_id,
      data.category_id,
    ];

    const result = await db.query(sql, params);
    return result.insertId;
  }

  static async update(id, data) {
    const updateFields = [];
    const params = [];

    // Build dynamic update query
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        // Only update fields that are provided
        if (key === "authors") {
          updateFields.push(`${key} = ?`);
          params.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = ?`);
          params.push(value);
        }
      }
    });

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    params.push(id);

    const sql = `
      UPDATE resources 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    await db.query(sql, params);
    return this.findById(id);
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
        r.file_url,
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
        r.file_url,
        r.file_public_id,
        c.id as category_id,
        c.name as category_name,
        COUNT(DISTINCT d.download_id) as downloads
      FROM resources r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN resource_authors ra ON r.id = ra.resource_id
      LEFT JOIN authors a ON ra.author_id = a.author_id
      LEFT JOIN downloads d ON r.id = d.resource_id
      WHERE r.id = ?
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
}

export default Resource;
