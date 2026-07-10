# Deployment Guide

This project has two deployable parts:

- `frontend`: React/Vite teaching app
- `backend`: FastAPI API service

## Recommended Setup

- Frontend: Vercel
- Backend: Render
- Share URL: the Vercel frontend URL

## Backend on Render

1. Push this project to GitHub.
2. In Render, create a new Web Service from the repository.
3. Use these settings:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Python Version: 3.11.9
```

4. Add environment variables:

```text
DEEPSEEK_API_KEY=your key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
CORS_ORIGINS=https://your-frontend-domain.vercel.app
IFLYTEK_APP_ID=your app id
IFLYTEK_API_KEY=your api key
IFLYTEK_API_SECRET=your api secret
```

5. After deployment, note the backend URL:

```text
https://your-backend.onrender.com
```

## Frontend on Vercel

1. Import the same GitHub repository into Vercel.
2. Set Root Directory:

```text
frontend
```

3. Add environment variable:

```text
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

4. Deploy.

The URL you share with others is the Vercel frontend URL:

```text
https://your-frontend-domain.vercel.app
```

## Important

- Do not share `localhost` URLs with other people.
- Microphone recording requires HTTPS in most browsers.
- For long-term classroom use, move from SQLite to PostgreSQL later.
