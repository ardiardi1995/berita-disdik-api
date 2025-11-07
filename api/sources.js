const cors = require('cors');

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

module.exports = async (req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      const sources = [
        {
          name: "detik.com",
          description: "Portal berita terpercaya Indonesia",
          category: "General News",
          active: true
        },
        {
          name: "kompas.com", 
          description: "Media online terdepan Indonesia",
          category: "General News",
          active: true
        },
        {
          name: "antaranews.com",
          description: "Kantor berita resmi Indonesia",
          category: "Official News",
          active: true
        }
      ];

      res.status(200).json({
        success: true,
        data: sources,
        total: sources.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message
      });
    }
  });
};