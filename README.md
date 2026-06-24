# 🎼 Orkestra - Hayat ve Uygulama Yönetim Sistemi

Orkestra, tüm hayatınızı, uygulamalarınızı, gelir/giderlerinizi, günlük rutinlerinizi ve projelerinizi tek bir platformdan yönetmenizi sağlayan kapsamlı bir yönetim sistemidir.

## ✨ Özellikler

### 🎯 Ana Özellikler
- **Uygulama Yönetimi**: Tüm uygulamalarınızı tek yerden yönetin
- **Hayat Kayıtları**: Günlük aktivitelerinizi fotoğraf ve videolarla kaydedin
- **Finans Takibi**: Gelir ve giderlerinizi detaylı şekilde takip edin
- **Rutin Yönetimi**: Günlük rutinlerinizi oluşturun ve takip edin
- **AI Asistan**: Claude AI ile kod oluşturun, analiz yapın
- **Otomasyon**: Tekrarlayan işlerinizi otomatikleştirin
- **Platform Orkestrası Paneli**: AI sağlayıcıları, araçlar, domain/DNS envanteri ve yayın görevlerini tek ekranda yönetin

### 🤖 AI Entegrasyonları
- **Claude AI**: Kod üretimi, analiz ve sohbet
- **Ollama**: Yerel AI modelleri desteği
- **Notion**: Otomatik veri senkronizasyonu

### 📊 Proje Takibi
- Proje fazlarını takip edin
- Tamamlanma sürelerini izleyin
- Ekran görüntüleri ve dökümanlar ekleyin
- Teknoloji yığınını yönetin

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB
- Git

### Adımlar

1. Repository'yi klonlayın:
```bash
git clone https://github.com/yourusername/orkestra.git
cd orkestra
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını düzenleyin:
```bash
cp .env.example .env
# .env dosyasını düzenleyip API anahtarlarını ekleyin
```

4. MongoDB'yi başlatın

5. Uygulamayı çalıştırın:
```bash
npm start
```

## 📁 Proje Yapısı

```
orkestra/
├── backend/
│   ├── models/          # Veritabanı modelleri
│   ├── routes/          # API route'ları
│   ├── services/        # AI ve harici servisler
│   ├── middleware/      # Express middleware'leri
│   ├── config/          # Konfigürasyon dosyaları
│   └── server.js        # Ana sunucu dosyası
├── frontend/
│   └── public/          # Frontend dosyaları
├── .env                 # Ortam değişkenleri
└── package.json
```

## 🔑 API Anahtarları

Aşağıdaki API anahtarlarına ihtiyacınız var:
- Claude API Key
- Notion API Key
- Ollama API Key
- GitHub Token
- Google OAuth Credentials

## 🌐 Deployment

### Sunucuya Yükleme

```bash
# Dosyaları sunucuya kopyalayın
scp -r orkestra/ bimuv@135.181.254.55:/home/bimuv/

# Sunucuya bağlanın
ssh bimuv@135.181.254.55

# Klasöre gidin
cd /home/bimuv/orkestra

# Bağımlılıkları yükleyin
npm install

# PM2 ile başlatın
pm2 start backend/server.js --name orkestra
pm2 save
```

### Nginx Konfigürasyonu

```nginx
server {
    listen 80;
    server_name orkestra.bitebimuv.org;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 Alt Alan Adları

Orkestra, aşağıdaki alt alan adlarındaki uygulamalarınızı yönetir:
- password.bitebimuv.org
- n8n.bitebimuv.org
- yz.bitebimuv.org
- sosyalmedya.bitebimuv.org
- api.bitebimuv.org
- pushbullet.bitebimuv.org
- bot.bitebimuv.org

## 🛠️ Teknolojiler

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Passport.js (Google OAuth)
- Claude AI SDK
- Notion SDK
- Axios

### Frontend
- Vanilla JavaScript
- Tailwind CSS
- Font Awesome Icons
- Chart.js

## 📝 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.

## 📧 İletişim

Sorularınız için: omerfarukkural@gmail.com

---

**Orkestra ile hayatınızı ve projelerinizi mükemmel bir uyum içinde yönetin! 🎵**
