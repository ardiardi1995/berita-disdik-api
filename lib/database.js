const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      // For Vercel, we'll use in-memory database or external service
      // In production, consider using external database like PlanetScale, Supabase, etc.
      this.db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
          reject(err);
        } else {
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS news (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          image_url TEXT,
          publish_date TEXT NOT NULL,
          source_name TEXT NOT NULL,
          content_preview TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.run(createTableSQL, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async insertNews(newsData) {
    return new Promise((resolve, reject) => {
      const { url, title, image_url, publish_date, source_name, content_preview } = newsData;
      
      const insertSQL = `
        INSERT OR REPLACE INTO news 
        (url, title, image_url, publish_date, source_name, content_preview, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      this.db.run(insertSQL, [url, title, image_url, publish_date, source_name, content_preview], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async getAllNews(limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
      const selectSQL = `
        SELECT * FROM news 
        ORDER BY publish_date DESC, created_at DESC 
        LIMIT ? OFFSET ?
      `;

      this.db.all(selectSQL, [limit, offset], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getNewsBySource(source_name, limit = 20) {
    return new Promise((resolve, reject) => {
      const selectSQL = `
        SELECT * FROM news 
        WHERE source_name = ?
        ORDER BY publish_date DESC, created_at DESC 
        LIMIT ?
      `;

      this.db.all(selectSQL, [source_name, limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async searchNews(query, limit = 20) {
    return new Promise((resolve, reject) => {
      const selectSQL = `
        SELECT * FROM news 
        WHERE title LIKE ? OR content_preview LIKE ?
        ORDER BY publish_date DESC, created_at DESC 
        LIMIT ?
      `;

      const searchQuery = `%${query}%`;
      this.db.all(selectSQL, [searchQuery, searchQuery, limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getNewsCount() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM news', (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }
}

module.exports = Database;