import Database from '../lib/postgres-database.js';
import NewsScraper from '../lib/scraper.js';
import cors from 'cors';

// Initialize database and scraper
let db;
let scraper;

async function initServices() {
  if (!db) {
    db = new Database();
    await db.init();
  }
  if (!scraper) {
    scraper = new NewsScraper();
  }
  return { db, scraper };
}

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export default function handler(req, res) {
  // Handle CORS
  corsMiddleware(req, res, async () => {
    try {
      const { db, scraper } = await initServices();
      const startTime = Date.now();

      console.log('Starting news scraping process...');

      // Scrape news from all sources
      const scrapedNews = await scraper.scrapeNews();
      console.log(`Found ${scrapedNews.length} positive news articles`);

      let savedCount = 0;
      let errorCount = 0;

      // Save each news item to database
      for (const newsItem of scrapedNews) {
        try {
          // Try to get additional content and better image
          const additionalContent = await scraper.scrapeArticleContent(newsItem.url);
          
          // Update news item with additional content if available
          if (additionalContent.content) {
            newsItem.content_preview = additionalContent.content;
          }
          if (additionalContent.imageUrl && !newsItem.image_url) {
            newsItem.image_url = additionalContent.imageUrl;
          }

          await db.insertNews(newsItem);
          savedCount++;
        } catch (error) {
          console.error(`Error saving news item: ${newsItem.title}`, error.message);
          errorCount++;
        }
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      const response = {
        success: true,
        message: 'News scraping completed',
        data: {
          totalScraped: scrapedNews.length,
          savedCount: savedCount,
          errorCount: errorCount,
          duration: `${duration}s`,
          timestamp: new Date().toISOString(),
          sources: scraper.sources.map(s => s.name)
        }
      };

      console.log('Scraping completed:', response.data);
      res.status(200).json(response);

    } catch (error) {
      console.error('Scraping Error:', error);
      res.status(500).json({
        success: false,
        error: 'Scraping Failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });
};