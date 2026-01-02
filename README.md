# 🚀 TIE-DAO React Landing Page - Complete Project Documentation

## 📋 Project Overview

**TIE-DAO** is a comprehensive Web3-enabled educational platform built with React and Node.js. It features:
- 🎓 **Quiz System** - Create and take quizzes with points
- 👥 **Referral Program** - Earn points by inviting friends
- 📊 **Leaderboards** - Compete with other users
- 🔐 **Admin Dashboard** - Manage quizzes, users, and view analytics
- 💾 **MongoDB Database** - Persistent data storage
- 🔑 **JWT Authentication** - Secure user authentication

---

## 🏗️ Project Architecture

```
TIE-DAO Platform
├── Frontend (React + Vite)
│   ├── Pages
│   │   ├── Login.jsx              → User login
│   │   ├── Signup.jsx             → User registration
│   │   ├── Dashboard.jsx          → User home dashboard
│   │   ├── AdminLogin.jsx         → Admin password authentication
│   │   └── AdminDashboard.jsx     → Admin control panel
│   │
│   ├── Components
│   │   ├── Hero.jsx               → Landing page
│   │   ├── Features.jsx           → Feature showcase
│   │   ├── Quiz.jsx               → Quiz interface
│   │   ├── QuizLeaderboard.jsx    → Quiz rankings
│   │   ├── Referral.jsx           → Referral system
│   │   ├── ReferralLeaderboard.jsx → Referral rankings
│   │   ├── ConfirmModal.jsx       → Custom confirmation modal
│   │   ├── Navbar.jsx             → Navigation bar
│   │   ├── Footer.jsx             → Footer
│   │   └── Other UI components
│   │
│   ├── Context
│   │   ├── AuthContext.jsx        → Authentication state
│   │   └── ThemeContext.jsx       → Theme management
│   │
│   ├── Config
│   │   └── api.js                 → API base URL
│   │
│   └── App.jsx                    → Main app component
│
└── Backend (Node.js + Express)
    ├── Models
    │   ├── User.js                → User schema with quiz & referral fields
    │   ├── Quiz.js                → Quiz structure with questions
    │   └── QuizAttempt.js         → Quiz submission tracking
    │
    ├── Routes
    │   ├── auth.js                → Login, signup, password reset
    │   ├── quiz.js                → Quiz CRUD and submission
    │   ├── referral.js            → Referral code & leaderboard
    │   ├── admin.js               → Admin dashboard endpoints
    │   ├── dashboard.js           → User dashboard data
    │   ├── contact.js             → Contact form
    │   └── dailyStreak.js         → Daily streak tracking
    │
    ├── Middleware
    │   ├── auth.js                → JWT authentication
    │   └── authMiddleware.js      → Protected routes
    │
    ├── Controllers
    │   └── authController.js      → Auth logic
    │
    └── API (Vercel)
        └── index.js               → Main server entry point
```

---

## 🔧 Technology Stack

### Frontend
```
- React 18+             → UI framework
- Vite                  → Build tool
- Tailwind CSS          → Styling
- Framer Motion         → Animations
- Recharts              → Data visualization
- Lucide React          → Icons
- Supabase              → Database (optional)
```

### Backend
```
- Node.js               → Runtime
- Express.js            → Web framework
- MongoDB               → Database
- Mongoose             → ODM (Object Document Mapper)
- JWT                   → Authentication
- Bcrypt                → Password hashing
```

### Deployment
```
- Vercel                → Frontend & API hosting
- MongoDB Atlas         → Cloud database
```

---

## 🚀 Getting Started

### Prerequisites
```bash
- Node.js 16+
- npm or yarn
- MongoDB Atlas account
- Git
```

### Installation

**1. Clone Repository**
```bash
git clone <repository-url>
cd tie-dao-react-landing
```

**2. Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

**3. Environment Setup**
Create `.env` in the `server/` directory:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tiesdao
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
```

**4. Start Development Servers**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm start
```

**5. Access Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 📚 Feature Documentation

### 🔐 Authentication System

#### Signup Flow
```javascript
1. User enters email, username, password
2. Password hashed with bcrypt
3. User created in MongoDB
4. JWT token generated and stored
5. User redirected to dashboard
```

**Endpoint**: `POST /api/auth/signup`
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "secure_password_123"
}
```

#### Login Flow
```javascript
1. User enters email and password
2. Password verified with bcrypt
3. JWT token generated
4. Token stored in localStorage
5. User redirected to dashboard
```

**Endpoint**: `POST /api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

#### Forgot Password (Implemented)
```javascript
1. User enters email
2. Verification email sent (optional)
3. Reset token generated
4. User sets new password
5. Password updated in database
```

**Endpoint**: `POST /api/auth/forgot-password`

### 🎓 Quiz System

#### Quiz Creation (Admin)
1. Admin creates quiz with:
   - Title, description, category
   - Difficulty level, points value
   - Multiple questions with options
2. Quiz saved to database
3. Marked as active/inactive

**Admin Endpoint**: `POST /api/admin/quizzes`

#### Quiz Taking (User)
1. User views quiz list: `GET /api/quiz`
2. Starts quiz: fetches details with `GET /api/quiz/:id`
3. Selects answers
4. Submits quiz: `POST /api/quiz/:id/submit`
5. Points calculated and awarded

**Points Calculation**:
```
Score = (Correct Answers / Total Questions) × Quiz Points
```

### 👥 Referral System

#### Generate Referral Code
```javascript
1. User generates unique referral code
2. Code stored in user profile
3. Shareable link created
4. Displayed on referral page
```

**Endpoint**: `POST /api/referral/generate`

#### Use Referral Code
```javascript
1. New user signs up with referral code
2. System verifies code exists
3. Referrer awarded 100 points
4. New user awarded 50 points
5. Both users linked in database
```

#### Referral Leaderboard
```javascript
1. Fetch all users sorted by referral points
2. Calculate referral count from:
   - Actual referredBy field, OR
   - Calculate from points (points ÷ 100)
3. Display ranking
```

**Endpoint**: `GET /api/referral/leaderboard`

### 📊 Admin Dashboard

#### Features
1. **Overview Tab**
   - Total users, quizzes, attempts
   - Active users, success rate
   - Charts and statistics

2. **Users Tab**
   - Search users by email/username
   - View user details
   - Suspend/unsuspend users
   - Reset user points
   - Delete users

3. **Quizzes Tab**
   - Create new quizzes
   - Edit quiz details
   - Duplicate quizzes
   - Delete quizzes
   - View attempts

4. **Analytics Tab**
   - Quiz performance metrics
   - Question difficulty analysis
   - User attempt statistics
   - Success rates

5. **Reports Tab**
   - Export user data (JSON)
   - Export quiz attempts (JSON)
   - Verify referral integrity
   - Check for broken chains

#### Admin Authentication
```javascript
// Access: /admin
// Password: TIE_DAO_ADMIN_2025 (CHANGE THIS IN PRODUCTION!)
// Authentication: Base64 encoded token
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  role: String, // "user" or "admin"
  referralCode: String (unique),
  referredBy: String,
  quizPoints: Number (default: 0),
  referralPoints: Number (default: 0),
  totalPoints: Number (default: 0),
  quizzesCompleted: Number (default: 0),
  suspended: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz Model
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
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### QuizAttempt Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  quizId: ObjectId (ref: Quiz),
  score: Number, // percentage 0-100
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

## 🔌 API Endpoints

### Authentication Routes
```
POST   /api/auth/signup                 → Register new user
POST   /api/auth/login                  → Login user
POST   /api/auth/forgot-password        → Request password reset
POST   /api/auth/reset-password         → Reset password with token
POST   /api/auth/profile                → Get user profile
PUT    /api/auth/profile                → Update user profile
POST   /api/auth/logout                 → Logout user
```

### Quiz Routes
```
GET    /api/quiz                        → List all active quizzes
GET    /api/quiz/:id                    → Get quiz details with questions
POST   /api/quiz/:id/submit             → Submit quiz answers
GET    /api/quiz/leaderboard/quiz       → Quiz performance leaderboard
GET    /api/quiz/user/history           → User's quiz history
```

### Referral Routes
```
POST   /api/referral/generate           → Generate referral code
GET    /api/referral/code               → Get user's referral code
GET    /api/referral/leaderboard        → Referral rankings
POST   /api/referral/use                → Apply referral code
```

### Admin Routes
```
POST   /api/admin/verify-password       → Verify admin password
GET    /api/admin/stats                 → Dashboard statistics
GET    /api/admin/users                 → List all users
GET    /api/admin/users/:userId         → Get user details
DELETE /api/admin/users/:userId         → Delete user
PATCH  /api/admin/users/:userId/suspend → Suspend/unsuspend user
PATCH  /api/admin/users/:userId/reset-points → Reset user points

GET    /api/admin/quizzes               → List all quizzes
POST   /api/admin/quizzes               → Create quiz
PUT    /api/admin/quizzes/:quizId       → Update quiz
DELETE /api/admin/quizzes/:quizId       → Delete quiz
POST   /api/admin/quizzes/:quizId/duplicate → Duplicate quiz

GET    /api/admin/analytics/quizzes     → Quiz analytics
GET    /api/admin/analytics/users/:userId → User analytics

GET    /api/admin/verify/referrals      → Verify referral chains
POST   /api/admin/export/users          → Export users data
POST   /api/admin/export/attempts       → Export quiz attempts
```

---

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Dark theme with blue/cyan accents
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Neon Accents**: Cyan, blue, purple gradients
- **Animations**: Smooth Framer Motion transitions
- **Icons**: Lucide React (no emojis)

### Responsive Design
```
Mobile (< 640px)    → Single column, stacked layout
Tablet (640-1024px) → 2-column layout
Desktop (> 1024px)  → Full 4-column layout
```

### Components

#### ConfirmModal
Professional modal replacement for `alert()` and `confirm()`
- Three types: delete (red), warning (yellow), success (green)
- Smooth animations
- Auto-dismiss on success
- Keyboard accessible

#### Navbar
- Responsive navigation
- Logo and brand
- User menu (login/logout)
- Admin access

#### Leaderboards
- Real-time ranking
- User statistics
- Point display
- Search functionality

---

## 🔍 Key Logic Explained

### Points System
```javascript
// Quiz Points
quizPoints = (correctAnswers / totalQuestions) × quizValue

// Referral Points
referrerPoints = +100 per successful referral
refereePoints = +50 when using code

// Total Points
totalPoints = quizPoints + referralPoints
```

### User Ranking
```javascript
// Sorted by totalPoints (descending)
// Leaderboard displays: username, points, rank
// Real-time updates on quiz/referral completion
```

### Referral Chain
```javascript
User A (referrer) → referralCode: "ABC123"
    ↓
User B (referee) → referredBy: "ABC123"
    ↓
User B invites → referralCode: "XYZ789"
    ↓
User C → referredBy: "XYZ789"

// Verifies no circular references
// Calculates depth and width
```

---

## ⚠️ Important Security Notes

### Passwords
- ⚠️ Change admin password from `TIE_DAO_ADMIN_2025`
- Use environment variable: `ADMIN_PASSWORD`
- Never commit to public repo

### Environment Variables
```
.env file structure:
MONGO_URI=your_connection_string
JWT_SECRET=your_secret_key
ADMIN_PASSWORD=your_secure_password
PORT=5000
```

### Best Practices
- ✅ Use HTTPS in production
- ✅ Validate all inputs on backend
- ✅ Hash passwords with bcrypt
- ✅ Use secure JWT secrets
- ✅ Implement rate limiting
- ✅ Add CORS restrictions
- ✅ Regular database backups

---

## 🧪 Testing Checklist

### Authentication
- [ ] Signup creates new user
- [ ] Login works with correct credentials
- [ ] JWT token stored in localStorage
- [ ] Protected routes blocked without token
- [ ] Logout clears token
- [ ] Forgot password works
- [ ] Password reset works

### Quiz System
- [ ] Admin can create quiz
- [ ] Users can see quiz list
- [ ] Quiz details load with questions
- [ ] Users can answer questions
- [ ] Points calculated correctly
- [ ] Results display properly
- [ ] Leaderboard updates

### Referral System
- [ ] User can generate code
- [ ] Code is unique
- [ ] New user can use code
- [ ] Points awarded correctly
- [ ] Leaderboard shows referrals
- [ ] Chains don't have cycles

### Admin Dashboard
- [ ] Admin can login
- [ ] Analytics display correctly
- [ ] Users can be managed
- [ ] Quizzes can be created/deleted
- [ ] Data exports work
- [ ] Referral verify works

---

## 📦 Deployment

### Environment Setup

**Production Environment Variables**:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/tiesdao-prod
JWT_SECRET=your_very_secure_secret_key_minimum_32_chars
ADMIN_PASSWORD=your_secure_admin_password
PORT=5000
```

### Deploy to Vercel

**Frontend**:
1. Push to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Backend**:
1. Create `vercel.json` in root
2. Configure serverless functions
3. Deploy backend separately or use Vercel Functions

### MongoDB Setup
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Add connection string to .env
5. Create database indexes for performance

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot GET /api/quiz"**
- Check backend is running
- Verify routes are imported in `server/api/index.js`
- Check API_BASE in frontend config

**"Quiz has no questions"**
- Fetch full quiz details with `GET /api/quiz/:id`
- Verify questions array exists in database
- Check admin created quiz with questions

**Login not working**
- Verify JWT_SECRET matches frontend/backend
- Check MongoDB connection
- Ensure user exists in database

**Analytics empty**
- Verify quiz attempts exist in database
- Check analytics endpoint returns data
- Check quizAnalytics state is updated

**Points not updating**
- Verify quiz submission endpoint is called
- Check user ID is passed correctly
- Verify MongoDB write permissions

### Debug Mode
```javascript
// Enable console logging
localStorage.setItem('DEBUG', 'true');

// Check network requests in DevTools
F12 → Network tab → API calls
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js](https://expressjs.com)
- [JWT Intro](https://jwt.io)
- [Framer Motion](https://www.framer.com/motion)

---

## 👥 Contributing

### Code Style
- Use modern ES6+ syntax
- Add comments for complex logic
- Keep functions under 50 lines
- Use meaningful variable names
- Test before committing

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request
5. Get code review
6. Merge to main

---

## 📝 License

This project is proprietary to TIE-DAO. All rights reserved.

---

## 📞 Support

For issues and questions:
1. Check troubleshooting section
2. Review documentation files
3. Check console for error messages
4. Contact development team

---

## 🎉 Project Status

**Current Version**: 1.0.0
**Status**: ✅ Production Ready
**Last Updated**: January 2, 2026

### Features Implemented
- ✅ User authentication (signup, login)
- ✅ Forgot password feature
- ✅ Quiz system (create, take, score)
- ✅ Quiz leaderboard
- ✅ Referral program
- ✅ Referral leaderboard
- ✅ Admin dashboard
- ✅ User management
- ✅ Quiz management
- ✅ Analytics
- ✅ Data export
- ✅ Custom modals
- ✅ Mobile responsive design

### Planned Features (Phase 2)
- [ ] Daily streak tracking
- [ ] Badge system
- [ ] Quiz categories filtering
- [ ] Advanced search
- [ ] Two-factor authentication
- [ ] Social sharing
- [ ] Mobile app
- [ ] API documentation (Swagger)

---

**Built with ❤️ for the TIE-DAO Community**
