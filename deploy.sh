#!/bin/bash

echo "🎼 Orkestra Deployment Script"
echo "=============================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SERVER="bimuv@135.181.254.55"
REMOTE_PATH="/home/bimuv/orkestra"
APP_NAME="orkestra"

echo -e "${BLUE}📦 Creating deployment package...${NC}"
cd ~/orkestra

# Create uploads directory if it doesn't exist
mkdir -p uploads/lifelogs

echo -e "${BLUE}📤 Uploading to server...${NC}"
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='uploads' \
    ~/orkestra/ ${SERVER}:${REMOTE_PATH}/

echo -e "${BLUE}🔧 Installing dependencies on server...${NC}"
ssh ${SERVER} << 'ENDSSH'
    cd /home/bimuv/orkestra
    npm install --production

    # Create necessary directories
    mkdir -p uploads/lifelogs
    mkdir -p logs

    # Set permissions
    chmod +x deploy.sh

    echo "✅ Dependencies installed"
ENDSSH

echo -e "${BLUE}🔄 Restarting application...${NC}"
ssh ${SERVER} << 'ENDSSH'
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2..."
        npm install -g pm2
    fi

    cd /home/bimuv/orkestra

    # Stop existing instance if running
    pm2 stop orkestra 2>/dev/null || true
    pm2 delete orkestra 2>/dev/null || true

    # Start application
    pm2 start backend/server.js --name orkestra
    pm2 save

    echo "✅ Application restarted"
ENDSSH

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application is running at: http://orkestra.bitebimuv.org${NC}"
echo -e "${BLUE}📊 Check logs with: ssh ${SERVER} 'pm2 logs orkestra'${NC}"
