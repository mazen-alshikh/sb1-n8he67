import { getDb, tables, query, queryAll, run } from '../config/database.js';
import { validateResourceData } from '../utils/validation.js';
import { v4 as uuidv4 } from 'uuid';

export class ResourceService {
  static async getAll() {
    return queryAll(`
      SELECT * FROM ${tables.resources} 
      ORDER BY created_at DESC
    `);
  }

  static async create(title, type, filePath) {
    const content = await validateResourceData(filePath, type);
    const id = uuidv4();

    run(`
      INSERT INTO ${tables.resources} (id, title, type, content)
      VALUES (?, ?, ?, ?)
    `, [id, title, type, JSON.stringify(content)]);

    return { id, title, type };
  }

  static async delete(id) {
    return run(`
      DELETE FROM ${tables.resources} 
      WHERE id = ?
    `, [id]);
  }
}