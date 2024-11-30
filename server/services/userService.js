import { getDb, tables, query, run } from '../config/database.js';
import { hash, verify } from '@node-rs/argon2';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  static async findByEmail(email) {
    return query(`SELECT * FROM ${tables.users} WHERE email = ?`, [email]);
  }

  static async verifyPassword(hashedPassword, plainPassword) {
    return verify(hashedPassword, plainPassword);
  }

  static async createUser(email, password, role = 'user') {
    const hashedPassword = await hash(password);
    const id = uuidv4();

    run(`
      INSERT INTO ${tables.users} (id, email, password, role)
      VALUES (?, ?, ?, ?)
    `, [id, email, hashedPassword, role]);

    return { id, email, role };
  }
}