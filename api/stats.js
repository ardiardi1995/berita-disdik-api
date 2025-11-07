const Database = require('../lib/postgres-database');
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
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

module.exports = async (req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      await initDb();

      // Get total news count
      const totalNews = await db.getNewsCount();

      // Get news by source
      const sources = ['detik.com', 'kompas.com', 'antaranews.com'];
      const sourceStats = {};
      
      for (const source of sources) {
        const sourceNews = await db.getNewsBySource(source, 1000);
        sourceStats[source] = sourceNews.length;
      }

      // Get recent news (last 7 days)
      const recentNews = await db.getAllNews(1000, 0);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentCount = recentNews.filter(news => {
        const newsDate = new Date(news.created_at);
        return newsDate >= sevenDaysAgo;
      }).length;

      const stats = {
        totalNews: totalNews,
        recentNews: recentCount,
        sourceBreakdown: sourceStats,
        lastScrapingTime: recentNews.length > 0 ? recentNews[0].created_at : null,
        apiVersion: "1.0.0",
        uptime: process.uptime() + "s",
        timestamp: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Stats Error:', error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message
      });
    }
  });
};