// Simple root handler
module.exports = (req, res) => {
  res.status(200).json({
    message: "Gowa Education News API",
    status: "Working",
    endpoints: {
      "/api/index": "API Information",
      "/api/news": "Get News",
      "/api/scrape": "Manual Scraping",
      "/api/sources": "News Sources",
      "/api/stats": "Statistics"
    },
    timestamp: new Date().toISOString()
  });
};