#!/bin/bash

# ===========================================
# ERPNext Setup Script for GHL-ERPNext
# ===========================================

set -e

echo "🚀 Setting up ERPNext for GHL-ERPNext integration..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start the containers
echo "📦 Starting Docker containers..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for ERPNext to be ready
echo "⏳ Waiting for ERPNext to initialize (this may take a few minutes)..."
sleep 30

# Check if ERPNext is ready
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:8000/api/method/frappe.ping > /dev/null 2>&1; then
        echo "✅ ERPNext is ready!"
        break
    fi
    echo "   Waiting for ERPNext... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 10
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ ERPNext did not start in time. Check logs with: docker-compose logs erpnext-dev"
    exit 1
fi

# Create API credentials
echo ""
echo "🔑 Creating API credentials..."
echo ""
echo "Please login to ERPNext at http://localhost:8000"
echo "   Username: Administrator"
echo "   Password: admin"
echo ""
echo "Then go to: Settings → Users → Administrator → API Access"
echo "Generate API Key and Secret and add them to your .env file"
echo ""

# Print summary
echo "===========================================
ERPNext is now running!

📍 ERPNext URL: http://localhost:8000
👤 Username: Administrator
🔑 Password: admin

Next steps:
1. Login to ERPNext
2. Complete the setup wizard (create a company)
3. Generate API credentials
4. Add credentials to your .env file
5. Start the GHL-ERPNext API: pnpm dev:api

For logs: docker-compose -f docker-compose.dev.yml logs -f
To stop: docker-compose -f docker-compose.dev.yml down
==========================================="
