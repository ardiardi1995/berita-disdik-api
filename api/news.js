const Database = require('../lib/database');
const cors = require('cors');

// Initialize database
let db;
async function initDb() {
  if (!db) {
    db = new Database();
    await db.init();
  }
  return db;
}

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

module.exports = async (req, res) => {
  // Handle CORS
  corsMiddleware(req, res, async () => {
    try {
      await initDb();

      const { method, query } = req;
      const { page = 1, limit = 20, source, search } = query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      switch (method) {
        case 'GET':
          let news;
          let total;

          if (search) {
            // Search news
            news = await db.searchNews(search, parseInt(limit));
            total = news.length;
          } else if (source) {
            // Get news by source
            news = await db.getNewsBySource(source, parseInt(limit));
            total = news.length;
          } else {
            // Get all news with pagination
            news = await db.getAllNews(parseInt(limit), offset);
            total = await db.getNewsCount();
          }

          const response = {
            success: true,
            data: news,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: total,
              totalPages: Math.ceil(total / parseInt(limit))
            },
            timestamp: new Date().toISOString()
          };

          res.status(200).json(response);
          break;

        default:
          res.setHeader('Allow', ['GET']);
          res.status(405).json({
            success: false,
            error: 'Method Not Allowed',
            message: 'Only GET method is allowed for this endpoint'
          });
          break;
      }
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
};