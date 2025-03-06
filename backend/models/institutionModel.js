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
}

export default Institution;
