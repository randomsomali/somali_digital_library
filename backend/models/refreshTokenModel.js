import db from '../config/db.js';

class RefreshToken {
  static async save(token, userId = null, adminId = null, institutionId = null) {
    const sql = `
      INSERT INTO refresh_tokens 
      (user_id, admin_id, institution_id, refresh_token, expires_at) 
      VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;
    
    const result = await db.query(sql, [userId, adminId, institutionId, token]);
    return result.insertId;
  }

  static async findValid(token) {
    const sql = `
      SELECT * FROM refresh_tokens 
      WHERE refresh_token = ? AND expires_at > NOW()
    `;
    
    const tokens = await db.query(sql, [token]);
    return tokens[0];
  }

  static async invalidate(token) {
    const sql = 'DELETE FROM refresh_tokens WHERE refresh_token = ?';
    await db.query(sql, [token]);
  }

  static async invalidateAllForUser(userId) {
    const sql = 'DELETE FROM refresh_tokens WHERE user_id = ?';
    await db.query(sql, [userId]);
  }
}

export default RefreshToken; 