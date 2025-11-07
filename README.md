# Gowa Education News API

API untuk berita positif berkaitan dengan Dinas Pendidikan Gowa dengan fitur scraping otomatis.

## Fitur

- ✅ Scraping otomatis berita setiap 2 kali sehari (06:00 dan 18:00)
- ✅ Filter berita positif berkaitan Dinas Pendidikan Gowa
- ✅ Ekstraksi gambar/sampul berita otomatis
- ✅ Paginasi dan pencarian
- ✅ Multiple sumber berita Indonesia
- ✅ RESTful API dengan CORS support
- ✅ Deploy-ready untuk Vercel

## API Endpoints

### GET `/api/news`
Mendapatkan daftar berita dengan paginasi.

**Parameters:**
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah berita per halaman (default: 20, max: 100)
- `source` (optional): Filter berdasarkan sumber berita
- `search` (optional): Pencarian berdasarkan judul dan konten

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "url": "https://detik.com/edu/detikpendidikan/...",
      "title": "Siswa SMA Gowa Raih Juara Nasional...",
      "image_url": "https://detik.com/image.jpg",
      "publish_date": "2024-01-15 10:30:00",
      "source_name": "detik.com",
      "content_preview": "Preview konten berita...",
      "created_at": "2024-01-15 10:35:00",
      "updated_at": "2024-01-15 10:35:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

### GET `/api/scrape`
Trigger manual scraping berita (otomatis berjalan 2x sehari).

### GET `/api/sources`
Mendapatkan daftar sumber berita yang tersedia.

### GET `/api/stats`
Mendapatkan statistik API.

### GET `/api/`
Mendapatkan informasi API dan dokumentasi.

## Sumber Berita

- **detik.com** - Portal berita terpercaya Indonesia
- **kompas.com** - Media online terdepan Indonesia  
- **antaranews.com** - Kantor berita resmi Indonesia

## Database Schema

```sql
CREATE TABLE news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  publish_date TEXT NOT NULL,
  source_name TEXT NOT NULL,
  content_preview TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Deploy ke Vercel

### 1. Persiapan
```bash
npm install -g vercel
```

### 2. Clone/Download Project
```bash
git clone <repository-url>
cd gowa-education-news-api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Deploy ke Vercel
```bash
vercel --prod
```

### 5. Konfigurasi Environment (Optional)
Jika menggunakan database eksternal, tambahkan environment variables di Vercel dashboard:
- `DATABASE_URL` - URL database eksternal (PlanetScale, Supabase, dll)

## Development

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000/api
```

### Manual Testing
```bash
# Test scraping
curl http://localhost:3000/api/scrape

# Get news
curl http://localhost:3000/api/news

# Get news with parameters
curl "http://localhost:3000/api/news?page=1&limit=10&search=prestasi"

# Get sources
curl http://localhost:3000/api/sources

# Get stats
curl http://localhost:3000/api/stats
```

## Manual Scraping

Scraping berita dilakukan secara manual melalui API endpoint:

```bash
# Trigger manual scraping
curl https://your-api.vercel.app/api/scrape
```

*Catatan: Cron job dihapus untuk menghemat kuota Vercel. Scraping dapat dipicu manual saat diperlukan.*

## Filter Berita Positif

API ini secara otomatis memfilter berita positif berdasarkan:

**Kata kunci positif:**
- prestasi, juara, berprestasi, sukses, berhasil
- terbaik, unggulan, inovasi, penghargaan
- lulus, wisuda, pelatihan, seminar
- bantuan, beasiswa, fasilitas baru
- dll.

**Kata kunci negatif (dikecualikan):**
- korupsi, kasus, tersangka, masalah
- kritik, protes, demo, tuntut
- rusak, roboh, bencana, kecelakaan
- dll.

## Troubleshooting

### Database di Vercel
Vercel menggunakan serverless functions, jadi database SQLite in-memory akan reset setiap request. Untuk production, disarankan menggunakan:

1. **PlanetScale** (MySQL)
2. **Supabase** (PostgreSQL) 
3. **MongoDB Atlas**
4. **Vercel KV** (Redis)

### CORS Issues
API sudah dikonfigurasi dengan CORS untuk semua origin (`*`). Jika ada masalah, pastikan request menggunakan header yang benar.

### Rate Limiting
Beberapa sumber berita mungkin membatasi request. Scraper sudah dikonfigurasi dengan:
- User-Agent header
- Timeout 10 detik
- Error handling

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## License

MIT License

## Support

Untuk support dan pertanyaan, silakan buat issue di repository ini.