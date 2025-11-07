// PostgreSQL database for Vercel with Neon
const { Client } = require('pg');

class PostgresDatabase {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      this.client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });

      await this.client.connect();
      await this.createTables();
      this.initialized = true;
      console.log('PostgreSQL database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  async createTables() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        url TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        image_url TEXT,
        publish_date TEXT NOT NULL,
        source_name TEXT NOT NULL,
        content_preview TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await this.client.query(createTableSQL);
      console.log('News table created/verified successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  async insertNews(newsData) {
    const { url, title, image_url, publish_date, source_name, content_preview } = newsData;
    
    const insertSQL = `
      INSERT INTO news (url, title, image_url, publish_date, source_name, content_preview, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (url) 
      DO UPDATE SET 
        title = EXCLUDED.title,
        image_url = EXCLUDED.image_url,
        publish_date = EXCLUDED.publish_date,
        content_preview = EXCLUDED.content_preview,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;

    try {
      const result = await this.client.query(insertSQL, [url, title, image_url, publish_date, source_name, content_preview]);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error inserting news:', error);
      throw error;
    }
  }

  async getAllNews(limit = 50, offset = 0) {
    const selectSQL = `
      SELECT * FROM news 
      ORDER BY publish_date DESC, created_at DESC 
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await this.client.query(selectSQL, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error getting all news:', error);
      throw error;
    }
  }

  async getNewsBySource(source_name, limit = 20) {
    const selectSQL = `
      SELECT * FROM news 
      WHERE source_name = $1
      ORDER BY publish_date DESC, created_at DESC 
      LIMIT $2
    `;

    try {
      const result = await this.client.query(selectSQL, [source_name, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting news by source:', error);
      throw error;
    }
  }

  async searchNews(query, limit = 20) {
    const selectSQL = `
      SELECT * FROM news 
      WHERE title ILIKE $1 OR content_preview ILIKE $1
      ORDER BY publish_date DESC, created_at DESC 
      LIMIT $2
    `;

    const searchQuery = `%${query}%`;
    try {
      const result = await this.client.query(selectSQL, [searchQuery, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }

  async getNewsCount() {
    try {
      const result = await this.client.query('SELECT COUNT(*) as count FROM news');
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting news count:', error);
      throw error;
    }
  }

  async close() {
    if (this.client) {
      await this.client.end();
      this.initialized = false;
    }
  }
}

module.exports = PostgresDatabase;