// Simple in-memory database for Vercel serverless
class SimpleDatabase {
  constructor() {
    this.news = [];
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      this.news = [];
      this.initialized = true;
    }
    return Promise.resolve();
  }

  async insertNews(newsData) {
    const { url, title, image_url, publish_date, source_name, content_preview } = newsData;
    
    // Check if news already exists
    const existingIndex = this.news.findIndex(item => item.url === url);
    
    const newsItem = {
      id: existingIndex >= 0 ? this.news[existingIndex].id : this.news.length + 1,
      url,
      title,
      image_url,
      publish_date,
      source_name,
      content_preview,
      created_at: existingIndex >= 0 ? this.news[existingIndex].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.news[existingIndex] = newsItem;
    } else {
      this.news.push(newsItem);
    }

    return Promise.resolve(newsItem.id);
  }

  async getAllNews(limit = 50, offset = 0) {
    const sorted = this.news.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
    const result = sorted.slice(offset, offset + limit);
    return Promise.resolve(result);
  }

  async getNewsBySource(source_name, limit = 20) {
    const filtered = this.news
      .filter(item => item.source_name === source_name)
      .sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date))
      .slice(0, limit);
    return Promise.resolve(filtered);
  }

  async searchNews(query, limit = 20) {
    const searchQuery = query.toLowerCase();
    const filtered = this.news
      .filter(item => 
        item.title.toLowerCase().includes(searchQuery) || 
        (item.content_preview && item.content_preview.toLowerCase().includes(searchQuery))
      )
      .sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date))
      .slice(0, limit);
    return Promise.resolve(filtered);
  }

  async getNewsCount() {
    return Promise.resolve(this.news.length);
  }
}

module.exports = SimpleDatabase;