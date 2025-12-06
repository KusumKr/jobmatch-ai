# Deploying Backend to Render

## Quick Setup Steps

1. **Push your backend code to GitHub** (already done)

2. **Go to Render Dashboard**: https://dashboard.render.com

3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `KusumKr/jobmatch-ai`
   - Set the following:
     - **Name**: `jobmatch-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

4. **Set Environment Variables** in Render dashboard:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = A strong random secret (e.g., generate with `openssl rand -base64 32`)
   - `FRONTEND_URL` = Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - `AI_SERVICE_URL` = `http://localhost:8000` (or your AI service URL if deployed separately)
   - `NODE_ENV` = `production`

5. **Deploy**: Click "Create Web Service"

6. **Get your backend URL**: Render will give you a URL like `https://jobmatch-backend.onrender.com`

7. **Update Frontend Environment Variable**:
   - In your frontend deployment (Vercel/Netlify), add:
     - `NEXT_PUBLIC_BACKEND_URL` = `https://jobmatch-backend.onrender.com`

8. **Redeploy Frontend** so it uses the new backend URL

## Testing

After deployment, test:
- `https://your-backend.onrender.com/health` should return `{"status":"ok"}`
- Try signup/login from your frontend

## Notes

- Render free tier spins down after 15 minutes of inactivity (first request will be slow)
- For production, consider Render paid tier or other hosting
- Make sure MongoDB Atlas allows connections from Render's IPs (Network Access settings)

