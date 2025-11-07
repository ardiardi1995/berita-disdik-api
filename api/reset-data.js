// Reset all news data from database (GET method for easy browser access)
import Database from '../lib/postgres-database.js';

let db;
async function initDb() {
  if (!db) {
    db = new Database();
    await db.init();
  }
  return db;
}

export default async function handler(req, res) {
  try {
    await initDb();
    
    console.log('Resetting all news data from database...');
    
    // Get count before deletion
    const countBefore = await db.getNewsCount();
    
    // Clear all news data
    await db.client.query('DELETE FROM news');
    
    // Reset auto-increment counter
    await db.client.query('ALTER SEQUENCE news_id_seq RESTART WITH 1');
    
    // Get count after deletion
    const countAfter = await db.getNewsCount();

    const response = {
      success: true,
      message: 'All news data reset successfully',
      data: {
        deletedCount: countBefore,
        remainingCount: countAfter,
        timestamp: new Date().toISOString(),
        note: "Database is now empty and ready for fresh data"
      }
    };

    console.log('Data reset:', response.data);
    res.status(200).json(response);

  } catch (error) {
    console.error('Reset Data Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}