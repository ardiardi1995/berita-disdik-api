// Dynamic imports for better compatibility

class NewsScraper {
  constructor() {
    this.sources = [
      {
        name: 'detik.com',
        searchUrl: 'https://www.detik.com/search/searchall?query=dinas+pendidikan+gowa',
        selectors: {
          articles: 'article',
          title: 'h2 a, h3 a',
          url: 'h2 a, h3 a',
          image: 'img',
          date: '.date, time'
        }
      },
      {
        name: 'kompas.com',
        searchUrl: 'https://search.kompas.com/search/?q=dinas+pendidikan+gowa',
        selectors: {
          articles: '.article__list',
          title: '.article__link',
          url: '.article__link',
          image: '.article__asset img',
          date: '.article__date'
        }
      },
      {
        name: 'antaranews.com',
        searchUrl: 'https://www.antaranews.com/search?q=dinas+pendidikan+gowa',
        selectors: {
          articles: '.simple-post',
          title: '.post-title a',
          url: '.post-title a',
          image: '.post-thumb img',
          date: '.simple-datetime'
        }
      }
    ];
  }

  async scrapeNews() {
    const allNews = [];
    
    for (const source of this.sources) {
      try {
        console.log(`Scraping from ${source.name}...`);
        const news = await this.scrapeFromSource(source);
        allNews.push(...news);
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error.message);
      }
    }

    return this.filterPositiveNews(allNews);
  }

  async scrapeFromSource(source) {
    try {
      const response = await axios.get(source.searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const articles = [];

      $(source.selectors.articles).each((index, element) => {
        try {
          const $article = $(element);
          
          const titleElement = $article.find(source.selectors.title).first();
          const title = titleElement.text().trim();
          
          let url = titleElement.attr('href');
          if (url && !url.startsWith('http')) {
            url = new URL(url, source.searchUrl).href;
          }

          const imageElement = $article.find(source.selectors.image).first();
          let imageUrl = imageElement.attr('src') || imageElement.attr('data-src');
          if (imageUrl && !imageUrl.startsWith('http') && imageUrl.startsWith('/')) {
            imageUrl = new URL(imageUrl, source.searchUrl).href;
          }

          const dateElement = $article.find(source.selectors.date).first();
          let publishDate = dateElement.text().trim() || dateElement.attr('datetime');

          if (title && url && this.isGowaEducationRelated(title)) {
            articles.push({
              title: title,
              url: url,
              image_url: imageUrl || '',
              publish_date: this.normalizeDate(publishDate),
              source_name: source.name,
              content_preview: title // We'll use title as preview for now
            });
          }
        } catch (error) {
          console.error(`Error processing article from ${source.name}:`, error.message);
        }
      });

      return articles;
    } catch (error) {
      console.error(`Failed to scrape ${source.name}:`, error.message);
      return [];
    }
  }

  isGowaEducationRelated(title) {
    const keywords = [
      'dinas pendidikan gowa',
      'pendidikan gowa',
      'gowa pendidikan',
      'sekolah gowa',
      'guru gowa',
      'siswa gowa',
      'kabupaten gowa',
      'dispendik gowa'
    ];

    const titleLower = title.toLowerCase();
    return keywords.some(keyword => titleLower.includes(keyword));
  }

  filterPositiveNews(newsArray) {
    const positiveKeywords = [
      'prestasi', 'juara', 'berprestasi', 'meraih', 'sukses', 'berhasil',
      'terbaik', 'unggulan', 'inovasi', 'penghargaan', 'gelar',
      'lulus', 'wisuda', 'promosi', 'naik', 'tingkatkan', 'kembangkan',
      'bangun', 'renovasi', 'bantuan', 'beasiswa', 'fasilitas',
      'program', 'pelatihan', 'workshop', 'seminar', 'kompetisi',
      'lomba', 'festival', 'pameran', 'launching', 'peresmian'
    ];

    const negativeKeywords = [
      'korupsi', 'kasus', 'tersangka', 'penangkapan', 'investigasi',
      'dugaan', 'pelanggaran', 'masalah', 'konflik', 'sengketa',
      'kritik', 'protes', 'demo', 'unjuk rasa', 'tuntut',
      'rusak', 'roboh', 'bencana', 'kecelakaan', 'meninggal'
    ];

    return newsArray.filter(news => {
      const titleLower = news.title.toLowerCase();
      const hasPositive = positiveKeywords.some(keyword => titleLower.includes(keyword));
      const hasNegative = negativeKeywords.some(keyword => titleLower.includes(keyword));
      
      return hasPositive && !hasNegative;
    });
  }

  normalizeDate(dateString) {
    if (!dateString) {
      return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }

    try {
      // Try to parse various date formats
      const cleanDate = dateString.replace(/WIB|WITA|WIT/gi, '').trim();
      const date = new Date(cleanDate);
      
      if (isNaN(date.getTime())) {
        return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      }
      
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }
  }

  // Enhanced scraping for specific article content
  async scrapeArticleContent(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Common selectors for article content
      const contentSelectors = [
        '.article-content',
        '.post-content',
        '.entry-content',
        '.content',
        '[class*="content"]',
        'p'
      ];

      let content = '';
      for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          content = element.first().text().trim();
          if (content.length > 100) break;
        }
      }

      // Get image if not found before
      let imageUrl = '';
      const imageSelectors = [
        'meta[property="og:image"]',
        '.article-image img',
        '.post-thumbnail img',
        '.featured-image img',
        'img[class*="featured"]'
      ];

      for (const selector of imageSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          imageUrl = element.attr('content') || element.attr('src');
          if (imageUrl) break;
        }
      }

      return {
        content: content.substring(0, 500), // Limit to 500 characters
        imageUrl: imageUrl
      };
    } catch (error) {
      console.error(`Error scraping content from ${url}:`, error.message);
      return { content: '', imageUrl: '' };
    }
  }
}

export default NewsScraper;