import mysql from "mysql2/promise";
import {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} from "./env.js";

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
    this.pool = null;
  }

  async connect() {
    try {
      if (!this.pool) {
        this.pool = mysql.createPool({
          host: MYSQL_HOST,
          user: MYSQL_USER,
          password: MYSQL_PASSWORD,
          database: MYSQL_DATABASE,
          port: MYSQL_PORT || 3306,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          dateStrings: true,
          namedPlaceholders: true,
          // Set SQL mode to be compatible with production MySQL instances
          sqlMode:
            "STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO",
        });

        // Test the connection
        const connection = await this.pool.getConnection();
        console.log("Database connected successfully");
        connection.release();
      }
      return this.pool;
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  async query(sql, params) {
    try {
      const pool = await this.connect();
      const [results] = await pool.query(sql, params);
      return results;
    } catch (error) {
      console.error("Query error:", error);
      throw error;
    }
  }

  async transaction(callback) {
    const pool = await this.connect();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new Database();
