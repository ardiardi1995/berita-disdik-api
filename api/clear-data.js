// Clear all news data from database
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
  // Only allow DELETE method for safety
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Use DELETE method to clear data'
    });
  }

  try {
    await initDb();
    
    console.log('Clearing all news data from database...');
    
    // Get count before deletion
    const countBefore = await db.getNewsCount();
    
    // Clear all news data
    await db.client.query('DELETE FROM news');
    
    // Get count after deletion
    const countAfter = await db.getNewsCount();

    const response = {
      success: true,
      message: 'All news data cleared successfully',
      data: {
        deletedCount: countBefore,
        remainingCount: countAfter,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Data cleared:', response.data);
    res.status(200).json(response);

  } catch (error) {
    console.error('Clear Data Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}