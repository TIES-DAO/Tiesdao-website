# 🔗 API Reference Guide

## Base URL
```
https://tiesdao-websiteert.onrender.com
```

## Authentication Header
```
Authorization: Bearer {JWT_TOKEN}
```

---

## 📚 QUIZ ENDPOINTS

### Get All Quizzes
```
GET /api/quiz
Headers: Authorization: Bearer {token}
Response: [{ _id, title, description, category, points, difficulty, isActive }]
```

### Get Single Quiz with Questions
```
GET /api/quiz/:id
Response: { _id, title, description, category, points, questions: [...], difficulty }
```

### Submit Quiz Attempt
```
POST /api/quiz/:id/submit
Headers: Authorization: Bearer {token}
Body: { answers: [0, 1, 2, ...] }
Response: {
  success: true,
  score: 8,
  totalQuestions: 10,
  pointsEarned: 80,
  message: "You scored 8/10!"
}
```

### Get Quiz Leaderboard
```
GET /api/quiz/leaderboard/quiz
Response: [{ _id, username, email, quizPoints, quizzesCompleted }]
```

### Get User's Quiz History
```
GET /api/quiz/user/history
Headers: Authorization: Bearer {token}
Response: [{ userId, quizId, score, totalQuestions, pointsEarned, answers, completedAt }]
```

### Create Quiz (Admin Only)
```
POST /api/quiz
Headers: Authorization: Bearer {admin_token}
Body: {
  title: "Python Basics",
  description: "Test your Python knowledge",
  category: "Programming",
  points: 50,
  difficulty: "medium",
  questions: [
    {
      question: "What is Python?",
      options: ["Language", "Snake", "Tool", "Framework"],
      correctAnswer: 0,
      explanation: "Python is a programming language"
    }
  ]
}
```

### Update Quiz (Admin Only)
```
PUT /api/quiz/:id
Headers: Authorization: Bearer {admin_token}
Body: { title, description, category, points, questions, difficulty }
```

### Delete Quiz (Admin Only)
```
DELETE /api/quiz/:id
Headers: Authorization: Bearer {admin_token}
```

---

## 🎁 REFERRAL ENDPOINTS

### Generate Referral Code
```
POST /api/referral/generate
Headers: Authorization: Bearer {token}
Response: { referralCode: "ABC123XYZ" }
```

### Get User Referral Info
```
GET /api/referral/info
Headers: Authorization: Bearer {token}
Response: {
  referralCode: "ABC123XYZ",
  referralPoints: 500,
  referralCount: 5
}
```

### Get Referral Leaderboard
```
GET /api/referral/leaderboard/referral
Response: [{ _id, username, email, referralPoints, referralCode }]
```

### Apply Referral Code (For New Users)
```
POST /api/referral/apply/:referralCode
Headers: Authorization: Bearer {token}
Response: {
  message: "Referral applied successfully!",
  bonusPoints: 50,
  referrerReward: 100
}
```

---

## 🔐 ADMIN ENDPOINTS

### Verify Admin Password
```
POST /api/admin/verify-password
Body: { password: "TIE_DAO_ADMIN_2025" }
Response: {
  success: true,
  token: "BASE64_ENCODED_TOKEN"
}
```

### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer {admin_token}
Response: [{ _id, username, email, quizPoints, referralPoints, totalPoints, quizzesCompleted, createdAt }]
```

### Get User Details with Quiz History
```
GET /api/admin/users/:userId
Headers: Authorization: Bearer {admin_token}
Response: {
  user: { _id, username, email, quizPoints, referralPoints, totalPoints },
  quizAttempts: [{ score, pointsEarned, quizId: { title, category } }]
}
```

### Delete User
```
DELETE /api/admin/users/:userId
Headers: Authorization: Bearer {admin_token}
Response: { message: "User deleted successfully" }
```

### Create Quiz
```
POST /api/admin/quizzes
Headers: Authorization: Bearer {admin_token}
Body: {
  title: "Quiz Title",
  description: "Description",
  category: "Category",
  points: 50,
  difficulty: "medium",
  questions: [...]
}
```

### Get All Quizzes
```
GET /api/admin/quizzes
Headers: Authorization: Bearer {admin_token}
Response: [{ _id, title, description, category, points, difficulty }]
```

### Update Quiz
```
PUT /api/admin/quizzes/:quizId
Headers: Authorization: Bearer {admin_token}
Body: { title, description, category, points, questions, difficulty }
```

### Delete Quiz
```
DELETE /api/admin/quizzes/:quizId
Headers: Authorization: Bearer {admin_token}
Response: { message: "Quiz deleted successfully" }
```

### Get Dashboard Stats
```
GET /api/admin/stats
Headers: Authorization: Bearer {admin_token}
Response: {
  totalUsers: 150,
  totalQuizzes: 25,
  totalAttempts: 2500,
  topUsers: [{ username, email, totalPoints, quizPoints, referralPoints }]
}
```

---

## 🧪 Testing with cURL

### Test Quiz Submission
```bash
curl -X POST https://tiesdao-websiteert.onrender.com/api/quiz/{quiz_id}/submit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"answers": [0, 1, 2, 0, 3]}'
```

### Test Referral Code Generation
```bash
curl -X POST https://tiesdao-websiteert.onrender.com/api/referral/generate \
  -H "Authorization: Bearer {token}"
```

### Test Admin Login
```bash
curl -X POST https://tiesdao-websiteert.onrender.com/api/admin/verify-password \
  -H "Content-Type: application/json" \
  -d '{"password": "TIE_DAO_ADMIN_2025"}'
```

---

## ⚠️ Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden / Access denied |
| 404 | Not found |
| 500 | Server error |

---

## 🔄 User Points Flow

### Taking a Quiz
1. User submits quiz answers
2. Backend calculates score
3. Points earned = (score / total_questions) × quiz_points
4. User.quizPoints += pointsEarned
5. User.totalPoints = quizPoints + referralPoints
6. User.quizzesCompleted += 1

### Using Referral Code
1. New user calls `/api/referral/apply/{code}`
2. Referrer found
3. Referrer.referralPoints += 100
4. NewUser.referralPoints += 50
5. Both totalPoints updated

---

## 📱 Frontend Integration Example

```javascript
// Submit Quiz
const response = await fetch(
  'https://tiesdao-websiteert.onrender.com/api/quiz/{id}/submit',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ answers: [0, 1, 2] })
  }
);
const data = await response.json();
console.log(`Score: ${data.score}/${data.totalQuestions}`);
console.log(`Points Earned: ${data.pointsEarned}`);
```

