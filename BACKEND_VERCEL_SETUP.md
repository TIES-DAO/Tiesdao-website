# Backend Vercel Setup Complete ✅

## What Was Done

### 1. **Backend API (server/api/index.js)**
- ✅ Updated CORS to accept dynamic origins from environment
- ✅ Added FRONTEND_URL environment variable support
- ✅ Converted to default export for Vercel serverless functions
- ✅ Added conditional server.listen() for development-only
- ✅ Vercel production-ready configuration

### 2. **Environment Configuration**
- ✅ Created `server/.env.example` - Template for backend variables
- ✅ Created `src/config/api.js` - API base URL configuration file
- ✅ Created `.env.example` - Template for frontend variables
- ✅ Added VITE_API_URL for dynamic API endpoint in production

### 3. **Deployment Files**
- ✅ `server/vercel.json` - Already configured correctly
- ✅ Created `VERCEL_DEPLOYMENT.md` - Complete deployment guide

---

## Next Steps to Deploy

### **Option 1: Deploy Both to Vercel (Recommended)**

#### Backend:
1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project
4. Add environment variables from `server/.env`
5. Deploy

#### Frontend:
1. Create new Vercel project from same repo
2. Root directory: `./`
3. Build: `npm run build`
4. Output: `dist`
5. Environment variables: `VITE_API_URL=https://[your-backend].vercel.app`
6. Deploy

### **Option 2: Deploy Only Backend to Vercel**
- Frontend stays local/on another host
- Update `VITE_API_URL` in frontend to point to Vercel backend
- Requires setting FRONTEND_URL in backend env vars

---

## Key Files Modified

```
server/api/index.js          → Updated for Vercel
server/.env.example          → NEW - Template for env vars
src/config/api.js            → NEW - API URL configuration
.env.example                 → NEW - Frontend env template
VERCEL_DEPLOYMENT.md         → NEW - Complete guide
```

---

## Environment Variables Needed for Production

### Backend (server/.env):
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
RECEIVE_EMAIL=admin_email
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env or Vercel dashboard):
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## Verification

To verify Vercel setup is working:

1. Test backend: Visit `https://[your-backend].vercel.app/`
   - Should return: `{ message: "TIE DAO API is running 🚀" }`

2. Test CORS: Frontend should fetch from backend without errors

3. Test endpoints:
   - Login: `POST /api/auth/login`
   - Quiz: `GET /api/quiz`
   - Referral: `GET /api/referral/info`
   - Admin: `POST /api/admin/verify-password`

---

## Notes

- CORS now supports multiple origins (localhost + Vercel domains)
- API base URL is dynamic via `import.meta.env.VITE_API_URL`
- MongoDB Atlas must allow Vercel IPs (0.0.0.0/0 whitelist)
- All hardcoded localhost URLs are eliminated
- Production and development both supported

**Ready to deploy! 🚀**
