# Client Setup Guide

## 🚀 One-Command Setup

```bash
./setup.sh
```

## 📋 What This Does

1. Creates `.env` file if it doesn't exist
2. Prompts you to add your OpenAI API key
3. Starts all services with Docker

## 🔑 Getting OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Paste it in the `.env` file

## 🌐 Access Points

Once running, access:
- **App**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **Database**: http://localhost:6333/dashboard

## 🛑 Stopping

Press `Ctrl+C` in the terminal where you ran `./setup.sh`

## 🔄 Restarting

Just run `./setup.sh` again! 