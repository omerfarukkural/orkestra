#!/bin/bash

echo "🗄️ MongoDB Installation Script"
echo "=============================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
   echo "⚠️  Please don't run as root. Run as regular user with sudo access."
   exit 1
fi

echo "📦 Installing MongoDB..."

# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check status
echo ""
echo "✅ MongoDB installed and started!"
echo ""
sudo systemctl status mongod --no-pager | head -10

echo ""
echo "🔧 MongoDB connection test..."
mongosh --eval "db.adminCommand('ping')"

echo ""
echo "✅ Installation complete!"
echo "💡 MongoDB is running on mongodb://localhost:27017"
echo "💡 To access MongoDB shell: mongosh"
