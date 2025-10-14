# 🎼 Orkestra Kurulum Rehberi

## 📋 İçindekiler
1. [Google OAuth Kurulumu](#google-oauth-kurulumu)
2. [MongoDB Kurulumu](#mongodb-kurulumu)
3. [Nginx Konfigürasyonu](#nginx-konfigürasyonu)
4. [PM2 ile Otomatik Başlatma](#pm2-ile-otomatik-başlatma)
5. [Sunucu Kurulumu](#sunucu-kurulumu)

## 🔐 Google OAuth Kurulumu

### 1. Google Cloud Console'a Giriş
1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin

### 2. OAuth 2.0 Credentials Oluşturma
1. Sol menüden **APIs & Services** > **Credentials** seçin
2. **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs** seçin
3. Application type olarak **Web application** seçin
4. Aşağıdaki bilgileri girin:

**Authorized JavaScript origins:**
```
http://orkestra.bitebimuv.org
http://135.181.254.55:5000
http://localhost:5000
```

**Authorized redirect URIs:**
```
http://orkestra.bitebimuv.org/auth/google/callback
http://135.181.254.55:5000/auth/google/callback
http://localhost:5000/auth/google/callback
```

5. **CREATE** butonuna tıklayın
6. Client ID ve Client Secret'ı kopyalayın

### 3. .env Dosyasını Güncelleyin
```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://orkestra.bitebimuv.org/auth/google/callback
```

## 🗄️ MongoDB Kurulumu

### Ubuntu/Debian için:
```bash
# MongoDB GPG anahtarını ekle
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# MongoDB repository'sini ekle
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Paket listesini güncelle
sudo apt-get update

# MongoDB'yi yükle
sudo apt-get install -y mongodb-org

# MongoDB'yi başlat
sudo systemctl start mongod
sudo systemctl enable mongod

# MongoDB durumunu kontrol et
sudo systemctl status mongod
```

### Veritabanı Kullanıcısı Oluşturma (İsteğe Bağlı):
```bash
mongosh

use orkestra
db.createUser({
  user: "orkestra_user",
  pwd: "secure_password_here",
  roles: [{ role: "readWrite", db: "orkestra" }]
})
```

Eğer kullanıcı oluşturduysanız, .env dosyasını güncelleyin:
```bash
MONGODB_URI=mongodb://orkestra_user:secure_password_here@localhost:27017/orkestra
```

## 🌐 Nginx Konfigürasyonu

### 1. Nginx Kurulumu
```bash
sudo apt update
sudo apt install nginx
```

### 2. Site Konfigürasyonu
```bash
sudo nano /etc/nginx/sites-available/orkestra
```

Aşağıdaki içeriği ekleyin:
```nginx
server {
    listen 80;
    server_name orkestra.bitebimuv.org;

    # Client max body size (for file uploads)
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Main application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files
    location /uploads {
        alias /home/bimuv/orkestra/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://localhost:5000/health;
    }
}
```

### 3. Site'ı Aktifleştirme
```bash
sudo ln -s /etc/nginx/sites-available/orkestra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Sertifikası (Let's Encrypt - İsteğe Bağlı)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d orkestra.bitebimuv.org
```

## 🚀 PM2 ile Otomatik Başlatma

### 1. PM2 Kurulumu
```bash
npm install -g pm2
```

### 2. Uygulamayı Başlatma
```bash
cd /home/bimuv/orkestra
pm2 start backend/server.js --name orkestra
pm2 save
pm2 startup
```

### 3. PM2 Komutları
```bash
# Uygulama durumunu kontrol et
pm2 status

# Logları görüntüle
pm2 logs orkestra

# Uygulamayı yeniden başlat
pm2 restart orkestra

# Uygulamayı durdur
pm2 stop orkestra

# Uygulamayı sil
pm2 delete orkestra

# Tüm uygulamaları yeniden başlat
pm2 restart all
```

## 🖥️ Sunucu Kurulumu

### 1. Sunucuya Bağlanma
```bash
ssh bimuv@135.181.254.55
```

### 2. Node.js Kurulumu
```bash
# NodeSource repository ekle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js kur
sudo apt-get install -y nodejs

# Versiyonu kontrol et
node --version
npm --version
```

### 3. Proje Klonlama
```bash
cd /home/bimuv
git clone https://github.com/omerfarukkural/orkestra.git
cd orkestra
```

### 4. Bağımlılıkları Yükleme
```bash
npm install
```

### 5. .env Dosyası Oluşturma
```bash
cp .env.example .env
nano .env
```

Tüm gerekli API anahtarlarını ve konfigürasyonları girin.

### 6. Dizinleri Oluşturma
```bash
mkdir -p uploads/lifelogs
mkdir -p logs
chmod 755 uploads
```

### 7. Uygulamayı Başlatma
```bash
pm2 start backend/server.js --name orkestra
pm2 save
```

## 🔧 Troubleshooting

### MongoDB Bağlantı Hatası
```bash
# MongoDB servisini kontrol et
sudo systemctl status mongod

# MongoDB loglarını kontrol et
sudo tail -f /var/log/mongodb/mongod.log

# MongoDB'yi yeniden başlat
sudo systemctl restart mongod
```

### Nginx Hatası
```bash
# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx loglarını kontrol et
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

### Port Kullanımda
```bash
# Port 5000'i kullanan processleri bul
sudo lsof -i :5000

# Process'i kapat
sudo kill -9 <PID>
```

### PM2 Logları
```bash
# Tüm logları görüntüle
pm2 logs

# Sadece hataları görüntüle
pm2 logs --err

# Logları temizle
pm2 flush
```

## 📊 Performans Optimizasyonu

### 1. Node.js Memory Limit
```bash
pm2 start backend/server.js --name orkestra --max-memory-restart 500M
```

### 2. Cluster Mode
```bash
pm2 start backend/server.js --name orkestra -i max
```

### 3. MongoDB İndeksleme
```javascript
// MongoDB shell'de çalıştır
db.applications.createIndex({ user: 1, createdAt: -1 })
db.lifelogs.createIndex({ user: 1, date: -1 })
db.transactions.createIndex({ user: 1, date: -1 })
db.routines.createIndex({ user: 1, active: 1 })
```

## 🔒 Güvenlik

### 1. Firewall Konfigürasyonu
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2ban Kurulumu
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. SSH Güvenliği
```bash
# SSH konfigürasyonunu düzenle
sudo nano /etc/ssh/sshd_config

# Şunları değiştir:
# PermitRootLogin no
# PasswordAuthentication no

# SSH'ı yeniden başlat
sudo systemctl restart sshd
```

## 📝 Yedekleme

### Otomatik Yedekleme Script'i
```bash
#!/bin/bash
BACKUP_DIR="/home/bimuv/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# MongoDB backup
mongodump --db orkestra --out $BACKUP_DIR/mongo_$DATE

# Application files backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /home/bimuv/orkestra

# Eski yedekleri sil (30 günden eski)
find $BACKUP_DIR -mtime +30 -delete

echo "Backup completed: $DATE"
```

Crontab'a ekle:
```bash
crontab -e

# Her gün 03:00'te yedek al
0 3 * * * /home/bimuv/backup-script.sh
```

## 🎯 Deployment

### Hızlı Deployment
```bash
cd ~/orkestra
./deploy.sh
```

### Manuel Deployment
```bash
# Sunucuya bağlan
ssh bimuv@135.181.254.55

# Güncelle
cd /home/bimuv/orkestra
git pull origin main
npm install
pm2 restart orkestra
```

## 📞 Destek

Sorun yaşarsanız:
- GitHub Issues: https://github.com/omerfarukkural/orkestra/issues
- Email: omerfarukkural@gmail.com

---

**Orkestra ile hayatınızı ve projelerinizi mükemmel bir uyum içinde yönetin! 🎵**
