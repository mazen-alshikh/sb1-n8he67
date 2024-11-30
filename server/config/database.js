import initSqlJs from 'sql.js';

let db = null;

export const tables = {
  users: 'users',
  resources: 'resources',
  questions: 'questions',
  verses: 'verses'
};

const schemas = {
  users: `
    CREATE TABLE IF NOT EXISTS ${tables.users} (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  resources: `
    CREATE TABLE IF NOT EXISTS ${tables.resources} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  questions: `
    CREATE TABLE IF NOT EXISTS ${tables.questions} (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      answer TEXT,
      references JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  verses: `
    CREATE TABLE IF NOT EXISTS ${tables.verses} (
      id TEXT PRIMARY KEY,
      chapter_number INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      text_uthmani TEXT NOT NULL,
      text_translation TEXT,
      page_number INTEGER,
      juz_number INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
};

export async function initializeDatabase() {
  if (db) return db;

  try {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    db = new SQL.Database();
    
    // Initialize tables
    Object.values(schemas).forEach(schema => {
      db.run(schema);
    });
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export function query(sql, params = []) {
  const stmt = getDb().prepare(sql);
  const result = stmt.getAsObject(params);
  stmt.free();
  return result;
}

export function queryAll(sql, params = []) {
  const stmt = getDb().prepare(sql);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function run(sql, params = []) {
  return getDb().run(sql, params);
}

export function transaction(callback) {
  const db = getDb();
  try {
    db.run('BEGIN TRANSACTION');
    callback();
    db.run('COMMIT');
  } catch (error) {
    db.run('ROLLBACK');
    throw error;
  }
}