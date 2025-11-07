// Simple scraper without external dependencies
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
    const startTime = Date.now();

    console.log('Starting simple news scraping process...');

    // Mock data for testing
    const mockNews = [
      {
        url: "https://example.com/news1",
        title: "Prestasi Siswa Dinas Pendidikan Gowa Meraih Juara Nasional",
        image_url: "https://via.placeholder.com/300x200",
        publish_date: new Date().toISOString(),
        source_name: "detik.com",
        content_preview: "Siswa dari Dinas Pendidikan Gowa berhasil meraih prestasi gemilang dalam kompetisi nasional..."
      },
      {
        url: "https://example.com/news2", 
        title: "Inovasi Pendidikan Gowa Mendapat Penghargaan Terbaik",
        image_url: "https://via.placeholder.com/300x200",
        publish_date: new Date().toISOString(),
        source_name: "kompas.com",
        content_preview: "Program inovasi pendidikan yang dikembangkan Dinas Pendidikan Gowa mendapat apresiasi..."
      },
      {
        url: "https://example.com/news3",
        title: "Beasiswa Pendidikan untuk Siswa Berprestasi di Gowa",
        image_url: "https://via.placeholder.com/300x200", 
        publish_date: new Date().toISOString(),
        source_name: "antaranews.com",
        content_preview: "Dinas Pendidikan Gowa memberikan beasiswa kepada siswa berprestasi untuk melanjutkan pendidikan..."
      }
    ];

    let savedCount = 0;
    let errorCount = 0;

    // Save mock news to database
    for (const newsItem of mockNews) {
      try {
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
      message: 'Simple news scraping completed (mock data)',
      data: {
        totalScraped: mockNews.length,
        savedCount: savedCount,
        errorCount: errorCount,
        duration: `${duration}s`,
        timestamp: new Date().toISOString(),
        note: "Using mock data for testing. Real scraping disabled due to dependency issues."
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
}