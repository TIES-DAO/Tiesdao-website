# ⚙️ SETUP & DEPLOYMENT GUIDE

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend (if needed)
cd ..
npm install
```

### 2. Environment Variables
Create `.env` file in the server directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Start Backend
```bash
cd server
npm start
```

### 4. Update API URLs
Replace `https://tiesdao-websiteert.onrender.com` with your actual API URL in:
- `src/components/Quiz.jsx` (line ~30)
- `src/components/QuizLeaderboard.jsx` (line ~23)
- `src/components/Referral.jsx` (line ~24)
- `src/components/ReferralLeaderboard.jsx` (line ~20)
- `src/Pages/SuperDashboard.jsx` (lines throughout)

---

## 🔐 CRITICAL: Change Admin Password

The admin dashboard uses a hardcoded password: **`TIE_DAO_ADMIN_2025`**

### To Change It:

1. Open `server/routes/admin.js`
2. Find line: `const ADMIN_PASSWORD = "TIE_DAO_ADMIN_2025";`
3. Change to a secure password
4. NEVER commit this password to public repositories

### Suggested Method:
Use environment variables instead:
```javascript
// In server/routes/admin.js
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "TIE_DAO_ADMIN_2025";

// In .env file
ADMIN_PASSWORD=your_secure_password_here
```

---

## 📦 New Files Created

### Backend Models
- ✅ `server/models/Quiz.js` - Quiz structure
- ✅ `server/models/QuizAttempt.js` - Quiz attempt tracking

### Backend Routes
- ✅ `server/routes/quiz.js` - Quiz endpoints
- ✅ `server/routes/referral.js` - Referral endpoints
- ✅ `server/routes/admin.js` - Admin dashboard endpoints

### Frontend Components
- ✅ `src/components/Quiz.jsx` - Quiz interface
- ✅ `src/components/QuizLeaderboard.jsx` - Quiz leaderboard
- ✅ `src/components/Referral.jsx` - Referral interface
- ✅ `src/components/ReferralLeaderboard.jsx` - Referral leaderboard

### Frontend Pages
- ✅ `src/Pages/SuperDashboard.jsx` - Admin dashboard

### Updated Files
- ✅ `server/models/User.js` - Added referral & quiz fields
- ✅ `server/api/index.js` - Added new routes
- ✅ `src/App.jsx` - Added new page routes
- ✅ `src/Pages/Dashboard.jsx` - Added navigation tabs

---

## 🧪 Testing the Features

### Test Quiz System
1. Go to `/quiz` (logged in)
2. Click "Start Quiz"
3. Answer questions
4. Submit and check points

### Test Referral System
1. Go to `/referral` (logged in)
2. Click "Generate Code"
3. Copy referral link
4. Share and test with new account

### Test Admin Dashboard
1. Go to `/admin`
2. Enter password: `TIE_DAO_ADMIN_2025`
3. View statistics and manage users/quizzes

---

## 📊 Database Schema

### User Document Updates
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String, // "user" or "admin"
  referralCode: String (unique),
  referralPoints: Number,
  quizPoints: Number,
  totalPoints: Number,
  quizzesCompleted: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  points: Number,
  difficulty: String, // "easy", "medium", "hard"
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }
  ],
  createdBy: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### QuizAttempt Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  quizId: ObjectId (ref: Quiz),
  score: Number,
  totalQuestions: Number,
  pointsEarned: Number,
  answers: [
    {
      questionId: Number,
      userAnswer: Number,
      isCorrect: Boolean
    }
  ],
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot GET /api/quiz"
**Solution**: Make sure quiz routes are registered in `server/api/index.js`
```javascript
import quizRoutes from "../routes/quiz.js";
app.use("/api/quiz", quizRoutes);
```

### Issue: Admin password not working
**Solution**: Check the exact password in `server/routes/admin.js`
- Default: `TIE_DAO_ADMIN_2025`
- Ensure no extra spaces or typos

### Issue: Points not updating
**Solution**: 
1. Check JWT token is valid
2. Verify user ID is being passed correctly
3. Check MongoDB connection

### Issue: API URL errors
**Solution**: Replace all instances of the old API URL with your new one:
```bash
# Find all occurrences
grep -r "tiesdao-websiteert.onrender.com" src/

# Replace in all files
sed -i 's/tiesdao-websiteert.onrender.com/your-new-url.com/g' src/**/*.jsx
```

---

## 📈 Points System Details

### Quiz Points Calculation
```
Points Earned = (Correct Answers / Total Questions) × Quiz Points
```

Example:
- Quiz has 10 questions worth 50 points total
- User gets 8 correct
- Points = (8/10) × 50 = 40 points

### Referral Points
```
Referrer: +100 points per successful referral
New User: +50 points for using a code
```

---

## 🔄 Data Migration (If Upgrading)

If you have existing users without the new fields, run this MongoDB query:
```javascript
db.users.updateMany(
  {},
  {
    $set: {
      referralCode: null,
      referralPoints: 0,
      quizPoints: 0,
      totalPoints: 0,
      quizzesCompleted: 0
    }
  }
);
```

---

## 📝 Monitoring & Logging

### Enable Debug Logging
Add to `server/api/index.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Check Server Logs
```bash
# If using PM2
pm2 logs

# If running directly
node server/api/index.js
```

---

## 🚨 Security Checklist

- [ ] Changed admin password from default
- [ ] Secured `.env` file (not in git)
- [ ] Verified JWT_SECRET is strong
- [ ] Checked CORS origin is correct
- [ ] Validated all user inputs on backend
- [ ] Rate limiting configured
- [ ] HTTPS enforced in production
- [ ] MongoDB credentials secured
- [ ] API keys not logged anywhere

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add quiz, referral, and admin features"
git push origin main
```

### 2. Connect to Vercel
- Go to vercel.com
- Import project from GitHub
- Set environment variables in Vercel dashboard
- Deploy

### 3. Update Frontend API URL
Change API calls to point to your backend (if deployed separately)

---

## 📞 Support Resources

- MongoDB Docs: https://docs.mongodb.com
- Express.js Docs: https://expressjs.com
- React Docs: https://react.dev
- Framer Motion: https://www.framer.com/motion

---

## ✅ Pre-Launch Checklist

- [ ] All routes tested and working
- [ ] Points system verified
- [ ] Leaderboards displaying correctly
- [ ] Admin dashboard password changed
- [ ] API URL updated in frontend
- [ ] Database backups configured
- [ ] Error handling implemented
- [ ] Mobile responsive design verified
- [ ] Performance optimized
- [ ] Security review completed

