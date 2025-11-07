# 🚀 Panduan Upload ke GitHub Repository

## Langkah-langkah Upload API ke Repository Anda

### 1. Persiapan Lokal
```bash
# Clone repository Anda
git clone https://github.com/ardiardi1995/berita-disdik-api.git
cd berita-disdik-api
```

### 2. Copy File-file API
Salin semua file berikut ke dalam folder repository:

**Root files:**
- `package.json`
- `vercel.json`
- `README.md`
- `.gitignore`

**Folder api/:**
- `api/index.js`
- `api/news.js`
- `api/scrape.js`
- `api/sources.js`
- `api/stats.js`

**Folder lib/:**
- `lib/database.js`
- `lib/scraper.js`

### 3. Install Dependencies dan Test
```bash
npm install
# Test lokal (optional)
npm run dev
```

### 4. Commit dan Push ke GitHub
```bash
git add .
git commit -m "✨ Add Gowa Education News API with auto-scraping

Features:
- Automatic news scraping 2x daily
- Positive news filtering for Dinas Pendidikan Gowa
- Multi-source scraping (Detik, Kompas, Antara)
- RESTful API with pagination and search
- Image extraction from news sources
- Vercel deployment ready"

git push origin main
```

### 5. Deploy ke Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📁 Struktur File yang Harus Di-upload
```
berita-disdik-api/
├── package.json
├── vercel.json
├── README.md
├── .gitignore
├── api/
│   ├── index.js
│   ├── news.js
│   ├── scrape.js
│   ├── sources.js
│   └── stats.js
└── lib/
    ├── database.js
    └── scraper.js
```

## 🔗 Setelah Deploy
API Anda akan tersedia di:
- `https://berita-disdik-api.vercel.app/api/news`
- `https://berita-disdik-api.vercel.app/api/scrape`
- `https://berita-disdik-api.vercel.app/api/sources`
- `https://berita-disdik-api.vercel.app/api/stats`

Scraping otomatis akan berjalan setiap 6 pagi dan 6 sore.