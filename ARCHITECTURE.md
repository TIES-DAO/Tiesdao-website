# 🎯 Feature Overview & Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Dashboard ──┬─→ Streak (Daily Check-in)                    │
│              ├─→ Quiz (Take Quizzes)                        │
│              ├─→ Quiz Leaderboard                           │
│              ├─→ Referral (Get Referral Code)               │
│              └─→ Referral Leaderboard                       │
│                                                               │
│  Admin Panel (Protected with Password)                      │
│    ├─→ Statistics (Users, Quizzes, Attempts)               │
│    ├─→ User Management (View, Delete, See Points)          │
│    └─→ Quiz Management (View, Create, Delete)              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express.js + Node)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Routes:                                                     │
│  ├─ /api/quiz                (Quiz Management)              │
│  ├─ /api/referral            (Referral Management)          │
│  ├─ /api/admin               (Admin Functions)              │
│  ├─ /api/auth                (Existing)                     │
│  ├─ /api/dashboard           (Existing)                     │
│  └─ /api/daily-streak        (Existing)                     │
│                                                               │
│  Models:                                                     │
│  ├─ User (+ referral, quiz fields)                          │
│  ├─ Quiz (NEW)                                              │
│  └─ QuizAttempt (NEW)                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓ Database Calls
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                            │
├─────────────────────────────────────────────────────────────┤
│  Collections:                                                │
│  ├─ users (Updated)                                         │
│  ├─ quizzes (NEW)                                           │
│  └─ quizattempts (NEW)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Points Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     User Points System                        │
└──────────────────────────────────────────────────────────────┘

        ┌─────────────────────────────────────────┐
        │         Total Points (totalPoints)      │
        └────────────┬──────────────┬─────────────┘
                     │              │
         ┌───────────▼─┐    ┌───────▼──────────┐
         │ Quiz Points │    │ Referral Points  │
         │ (quizPoints)│    │(referralPoints)  │
         └───────────┬─┘    └───────┬──────────┘
                     │              │
        ┌────────────▼──┐  ┌────────▼──────────┐
        │ Take Quiz →   │  │ Share Referral →  │
        │ Get Points    │  │ +100 pts          │
        │ (per score)   │  │ Referrer:   +100  │
        │               │  │ New User:    +50  │
        └───────────────┘  └───────────────────┘
```

---

## 🎮 User Journey

### Journey 1: Quiz Taker
```
1. User logs in
   ↓
2. Navigates to /quiz
   ↓
3. Views available quizzes with difficulty & points
   ↓
4. Clicks "Start Quiz"
   ↓
5. Answers questions (can go back/forward)
   ↓
6. Submits quiz
   ↓
7. Backend calculates score & awards points
   ↓
8. User sees result: "You scored 8/10! +40 Points! 🎉"
   ↓
9. Points added to user.quizPoints & user.totalPoints
   ↓
10. Can check /quiz-leaderboard to see ranking
```

### Journey 2: Referral Ambassador
```
1. User logs in
   ↓
2. Navigates to /referral
   ↓
3. Clicks "Generate Code"
   ↓
4. Gets unique code (e.g., "ABC123XYZ")
   ↓
5. Clicks "Copy Referral Link"
   ↓
6. Shares link with friends
   ↓
7. Friend signs up using the link
   ↓
8. Friend gets +50 bonus points
   ↓
9. Original user gets +100 referral points
   ↓
10. Can check /referral-leaderboard for ranking
```

### Journey 3: Admin Management
```
1. Admin goes to /admin
   ↓
2. Enters password (TIE_DAO_ADMIN_2025)
   ↓
3. Sees three tabs: Statistics, Users, Quizzes
   ↓
4. Statistics Tab:
   └─ View total users, quizzes, attempts
   └─ See top 10 users by points
   ↓
5. Users Tab:
   └─ View all users with points breakdown
   └─ Click on user to see quiz history
   └─ Delete user if needed
   ↓
6. Quizzes Tab:
   └─ View all quizzes
   └─ Delete quizzes
   └─ Add new quizzes (via API)
```

---

## 🗄️ Database Relationships

```
┌─────────────┐         ┌────────────┐          ┌──────────────┐
│   User      │◄─────── │    Quiz    │ ────────►│  QuizAttempt │
│             │         │            │          │              │
│ _id         │◄─────┐  │ _id        │◄─────┐   │ _id          │
│ username    │      │  │ title      │      │   │ userId       │ (FK)
│ email       │      └──│ createdBy  │      │   │ quizId       │ (FK)
│ points      │         │ questions  │      │   │ score        │
│ referralCode├──────┐  │ points     │      │   │ pointsEarned │
│             │      │  │ difficulty │      │   │ answers      │
└─────────────┘      │  └────────────┘      │   └──────────────┘
                     │                       │
                     └───────────────────────┘
                         1:Many
                    One user can have
                    many quiz attempts
```

---

## 📈 Leaderboard Rankings

### Quiz Leaderboard
```
Rank │ Player      │ Email           │ Points  │ Quizzes
─────┼─────────────┼─────────────────┼─────────┼────────
🥇 1 │ Alice       │ alice@test.com  │  450    │    15
🥈 2 │ Bob         │ bob@test.com    │  380    │    12
🥉 3 │ Charlie     │ charlie@test.com│  320    │    10
   4 │ David       │ david@test.com  │  290    │     9
   5 │ Eve         │ eve@test.com    │  250    │     8
```

### Referral Leaderboard
```
Rank │ Influencer  │ Email           │ Points  │ Code
─────┼─────────────┼─────────────────┼─────────┼──────────
🥇 1 │ Steve       │ steve@test.com  │  800    │ ABC123
🥈 2 │ Sarah       │ sarah@test.com  │  700    │ DEF456
🥉 3 │ Sophie      │ sophie@test.com │  600    │ GHI789
   4 │ Sam         │ sam@test.com    │  500    │ JKL012
   5 │ Sophia      │ sophia@test.com │  400    │ MNO345
```

---

## 🔄 API Response Examples

### Create Quiz Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Python Basics",
  "description": "Learn Python fundamentals",
  "category": "Programming",
  "points": 50,
  "difficulty": "easy",
  "isActive": true,
  "createdBy": "507f1f77bcf86cd799439012",
  "questions": [
    {
      "question": "What is Python?",
      "options": ["Language", "Snake", "Tool", "Framework"],
      "correctAnswer": 0,
      "explanation": "Python is a programming language"
    }
  ],
  "createdAt": "2025-12-31T10:00:00.000Z",
  "updatedAt": "2025-12-31T10:00:00.000Z"
}
```

### Submit Quiz Response
```json
{
  "success": true,
  "score": 8,
  "totalQuestions": 10,
  "pointsEarned": 40,
  "message": "You scored 8/10! 🎉"
}
```

### Referral Info Response
```json
{
  "referralCode": "ABC123XYZ",
  "referralPoints": 500,
  "referralCount": 5
}
```

### Admin Stats Response
```json
{
  "totalUsers": 150,
  "totalQuizzes": 25,
  "totalAttempts": 2500,
  "topUsers": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "Alice",
      "email": "alice@test.com",
      "totalPoints": 450,
      "quizPoints": 350,
      "referralPoints": 100
    }
  ]
}
```

---

## 🎨 UI Components Breakdown

### Quiz Component
- Quiz List (Grid of available quizzes)
- Quiz Taker (Interactive question interface)
- Quiz Result (Score and points display)

### Quiz Leaderboard Component
- Sorted table by points
- Medal indicators for top 3
- User rank display

### Referral Component
- Referral Code Display
- Copy to Clipboard button
- Stats cards (Points & Count)
- How it works info

### ReferralLeaderboard Component
- Sorted table by points
- Medal indicators
- Referral code display

### Super Dashboard Component
- Password login
- Statistics tab (Cards + Top users)
- Users tab (Table + Delete + View details)
- Quizzes tab (Table + Delete + Add)

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   User Authentication Flow                  │
└─────────────────────────────────────────────────────────────┘

1. User Login
   └─ Sends email & password to /api/auth/login
   └─ Backend returns JWT token
   └─ Token stored in localStorage

2. API Requests
   └─ All protected routes require token
   └─ Token sent in Authorization header
   └─ Backend verifies token

3. Admin Access
   └─ User navigates to /admin
   └─ Enters admin password
   └─ Backend creates temporary admin token
   └─ Token used for admin API calls

4. Protected Routes
   └─ Quiz (/quiz) - Requires user auth
   └─ Referral (/referral) - Requires user auth
   └─ Admin (/admin) - Requires admin password
```

---

## 📱 Responsive Design

All components use Tailwind CSS with responsive breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Navigation tabs become a single column on mobile for better UX.

---

## ⚡ Performance Optimizations

1. **Lazy Loading**: Quiz and leaderboard data loaded on demand
2. **Pagination**: Leaderboards limited to top 100 users
3. **Caching**: User data cached in state
4. **Memoization**: Components use React.memo where applicable
5. **Animations**: Framer Motion for smooth UI transitions

---

## 🛡️ Security Layers

1. **Frontend**: Protected routes require authentication
2. **Backend**: JWT verification on protected endpoints
3. **Admin**: Password verification for admin routes
4. **Database**: MongoDB validation schemas
5. **API**: CORS restrictions to approved origins

