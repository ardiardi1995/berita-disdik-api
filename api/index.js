const cors = require('cors');

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

module.exports = async (req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      const apiInfo = {
        name: "Gowa Education News API",
        description: "API untuk berita positif Dinas Pendidikan Gowa",
        version: "1.0.0",
        endpoints: {
          "/api/news": {
            method: "GET",
            description: "Get all news with pagination",
            parameters: {
              page: "Page number (default: 1)",
              limit: "Items per page (default: 20, max: 100)",
              source: "Filter by source name",
              search: "Search in title and content"
            }
          },
          "/api/scrape": {
            method: "GET/POST",
            description: "Trigger manual news scraping",
            note: "Automatically runs twice daily at 6 AM and 6 PM"
          },
          "/api/sources": {
            method: "GET",
            description: "Get available news sources"
          },
          "/api/stats": {
            method: "GET",
            description: "Get API statistics"
          }
        },
        features: [
          "Automatic news scraping twice daily",
          "Positive news filtering",
          "Multiple Indonesian news sources",
          "Image extraction from articles",
          "Full-text search capability",
          "Pagination support",
          "CORS enabled"
        ],
        sources: [
          "detik.com",
          "kompas.com", 
          "antaranews.com"
        ],
        lastUpdated: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        data: apiInfo
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