#!/bin/bash

echo "🚀 GenAI Labs Technical Challenge - Quick Setup"
echo "=============================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and add your OpenAI API key"
    echo "   Get your API key from: https://platform.openai.com/api-keys"
    echo ""
    read -p "Press Enter after you've added your API key..."
else
    echo "✅ .env file already exists"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "🐳 Starting the application with Docker..."
echo ""

docker-compose up 