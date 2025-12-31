# Vercel Deployment Guide

## Backend Setup (Node.js + Express)

### 1. **Push to GitHub**
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Deploy Backend to Vercel**

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Select the **root** project folder (not the `server` folder)
5. Click "Deploy"

### 3. **Configure Environment Variables**

After deployment, go to **Settings** → **Environment Variables** and add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RECEIVE_EMAIL=admin@example.com
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 4. **Update Vercel.json for API Routes**

The `server/vercel.json` is already configured to route all requests to `/api/index.js`.

---

## Frontend Setup (React + Vite)

### 1. **Configure API URL for Production**

Create or update `.env.production`:
```
VITE_API_URL=https://your-backend-domain.vercel.app
```

### 2. **Deploy Frontend to Vercel**

1. In Vercel Dashboard, click "Add New..." → "Project"
2. Select your repository again
3. Set **Root Directory** to `./` (project root)
4. Set **Build Command** to: `npm run build`
5. Set **Output Directory** to: `dist`
6. Add Environment Variable:
   - `VITE_API_URL=https://your-backend-api-url.vercel.app`
7. Click "Deploy"

### 3. **Update Links**

After getting your Vercel URLs:
- Backend API: `https://your-project.vercel.app`
- Frontend: `https://your-project.vercel.app`

Update the `FRONTEND_URL` in backend environment variables to match your frontend URL.

---

## API Endpoint Changes

All API calls will use the environment variable:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

### Example API Calls (update these in your components):

**Before:**
```javascript
fetch("http://localhost:5000/api/auth/login", { ... })
```

**After (using API config):**
```javascript
import API_BASE from "../config/api.js";
fetch(`${API_BASE}/api/auth/login`, { ... })
```

---

## Deployment Checklist

- [ ] GitHub repository connected to Vercel
- [ ] Backend deployed with all environment variables
- [ ] Frontend deployed with `VITE_API_URL` pointing to backend
- [ ] CORS configured to allow frontend domain
- [ ] MongoDB connection verified in production
- [ ] Test login/signup on production URLs
- [ ] Test quiz submission on production
- [ ] Test referral system on production
- [ ] Admin dashboard accessible at `/admin`

---

## Troubleshooting

### "Failed to fetch" errors
- Check `VITE_API_URL` environment variable
- Verify CORS settings in backend
- Check backend is actually running on Vercel

### MongoDB Connection Errors
- Verify `MONGO_URI` environment variable
- Check IP whitelist in MongoDB Atlas (add `0.0.0.0/0`)
- Ensure credentials are correct

### Build Failures
- Check `npm run build` runs locally first
- Verify all imports are correct
- Check for missing dependencies

---

## Local Development

To test locally before deploying:

```bash
# Terminal 1: Backend
cd server
npm install
npm start

# Terminal 2: Frontend
npm install
npm run dev
```

Access frontend at `http://localhost:5173`
