# 🧪 Complete Testing Guide

## Overview
This guide provides comprehensive instructions for testing all features of the TIE-DAO platform, from basic authentication to advanced admin functionalities.

---

## ✅ Test Scenarios

### 1️⃣ Authentication System

#### A) Signup Flow
**Steps:**
1. Navigate to `/register`
2. Enter email, username, and password (min 6 chars)
3. Click "Sign Up"
4. Should redirect to `/dashboard`
5. Check localStorage for `token`

**Expected Results:**
- ✅ User created in MongoDB
- ✅ JWT token generated and stored
- ✅ Referral code auto-generated
- ✅ Initial points: 0

**Test Cases:**
- [ ] Valid signup creates user
- [ ] Duplicate email shows error
- [ ] Password < 6 chars shows validation error
- [ ] Empty fields show required errors
- [ ] Referral code with signup applies bonus (+50 points)

---

#### B) Login Flow
**Steps:**
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"
4. Should redirect to `/dashboard`

**Expected Results:**
- ✅ User authenticated
- ✅ JWT token stored in localStorage
- ✅ User profile loaded
- ✅ Can access protected routes

**Test Cases:**
- [ ] Valid credentials login succeeds
- [ ] Wrong password shows error
- [ ] Non-existent email shows error
- [ ] Token stored and valid
- [ ] Token persists after page reload
- [ ] Expired token redirects to login

---

#### C) Forgot Password Flow
**Steps:**
1. Navigate to `/login`
2. Click "Forgot password?"
3. Enter email
4. Click "Send Reset Code"
5. Check browser console (dev mode) for reset code
6. Enter 6-digit code
7. Click "Verify Code"
8. Enter new password (2x)
9. Click "Reset Password"
10. Should redirect to login

**Expected Results:**
- ✅ Reset code generated (logged to console in dev)
- ✅ Reset token stored in database with 1-hour expiry
- ✅ Password reset updates in database
- ✅ Can login with new password

**Test Cases:**
- [ ] Non-existent email shows error
- [ ] Invalid reset code shows error
- [ ] Expired reset code shows error
- [ ] Password mismatch shows error
- [ ] Password < 6 chars shows error
- [ ] Successful reset allows new login
- [ ] Old password no longer works

---

#### D) Logout
**Steps:**
1. Login to dashboard
2. Click user menu → Logout
3. Should redirect to home page

**Expected Results:**
- ✅ Token removed from localStorage
- ✅ Protected routes become inaccessible
- ✅ Redirected to login on protected route access

---

### 2️⃣ Quiz System

#### A) View Quiz List
**Steps:**
1. Login and go to `/quiz`
2. See list of all quizzes

**Expected Results:**
- ✅ All active quizzes displayed
- ✅ Quiz title, category, points shown
- ✅ Can search/filter quizzes

**Test Cases:**
- [ ] Quiz list loads
- [ ] Quizzes show correct info
- [ ] Search filters quizzes
- [ ] Can see quiz points

---

#### B) Take Quiz
**Steps:**
1. Click on a quiz
2. Review quiz details
3. Click "Start Quiz"
4. Answer all questions
5. Click "Submit"
6. See results

**Expected Results:**
- ✅ Quiz questions load with options
- ✅ Can select answers
- ✅ Score calculated correctly
- ✅ Points awarded (if passing)
- ✅ Results saved to database
- ✅ Leaderboard updates

**Test Cases:**
- [ ] Quiz loads with all questions
- [ ] Can answer questions
- [ ] Score calculation correct
- [ ] Points awarded properly
- [ ] Results persist after reload
- [ ] User points increase
- [ ] Can retake quiz

---

#### C) Quiz Leaderboard
**Steps:**
1. Navigate to `/quiz-leaderboard`
2. View ranking

**Expected Results:**
- ✅ Users ranked by quiz points (descending)
- ✅ User position shown
- ✅ Real-time updates

**Test Cases:**
- [ ] Leaderboard loads
- [ ] Rankings correct
- [ ] Updates after quiz completion
- [ ] User sees own rank

---

### 3️⃣ Referral System

#### A) Generate Referral Code
**Steps:**
1. Go to `/referral`
2. See unique referral code
3. Copy referral link

**Expected Results:**
- ✅ Unique code generated per user
- ✅ Code displayed and copyable
- ✅ Referral link generates correctly

**Test Cases:**
- [ ] Code is unique per user
- [ ] Code is shareable
- [ ] Link format correct
- [ ] Code never changes

---

#### B) Use Referral Code
**Steps:**
1. Get referral link from friend
2. Navigate with `?ref=CODE` in URL
3. Complete signup with that code
4. Check points awarded

**Expected Results:**
- ✅ New user awarded +50 points
- ✅ Referrer awarded +100 points
- ✅ Points visible in dashboard
- ✅ Referral chain tracked

**Test Cases:**
- [ ] Referral code auto-fills on signup
- [ ] New user gets +50 bonus
- [ ] Referrer gets +100 bonus
- [ ] Points update immediately
- [ ] Referral chain established

---

#### C) Referral Leaderboard
**Steps:**
1. Navigate to `/referral-leaderboard`
2. View rankings

**Expected Results:**
- ✅ Users ranked by referral points (descending)
- ✅ User position shown
- ✅ Real-time updates

**Test Cases:**
- [ ] Leaderboard loads
- [ ] Rankings correct
- [ ] Updates after referral
- [ ] User sees own rank

---

### 4️⃣ User Dashboard

#### A) View Profile
**Steps:**
1. Login and go to `/dashboard`
2. See user profile

**Expected Results:**
- ✅ Username, email displayed
- ✅ Total points shown
- ✅ Quiz and referral points breakdown
- ✅ Quizzes completed count
- ✅ Referral code visible

**Test Cases:**
- [ ] Profile loads
- [ ] All info correct
- [ ] Points calculated correctly
- [ ] Referral code visible and copyable

---

#### B) View Quick Stats
**Steps:**
1. On dashboard, check stats cards

**Expected Results:**
- ✅ Total points visible
- ✅ Quizzes completed shown
- ✅ Referrals count shown
- ✅ Stats update in real-time

**Test Cases:**
- [ ] Stats load correctly
- [ ] Numbers match user data
- [ ] Updates after quiz/referral

---

### 5️⃣ Admin Dashboard

#### A) Admin Login
**Steps:**
1. Navigate to `/admin-login`
2. Enter password: `TIE_DAO_ADMIN_2025`
3. Click "Login"
4. Should show admin dashboard

**Expected Results:**
- ✅ Admin authenticated
- ✅ Admin token stored
- ✅ Dashboard accessible
- ⚠️ **IMPORTANT:** Change this password in production!

**Test Cases:**
- [ ] Correct password allows access
- [ ] Wrong password shows error
- [ ] Token persists across pages
- [ ] Logout clears token

---

#### B) Overview Tab
**Steps:**
1. Login to admin dashboard
2. Check "Overview" tab

**Expected Results:**
- ✅ Total users shown
- ✅ Total quizzes shown
- ✅ Total quiz attempts shown
- ✅ Charts and graphs visible
- ✅ Success rate calculated

**Test Cases:**
- [ ] Stats load correctly
- [ ] Numbers are accurate
- [ ] Charts render
- [ ] Data updates dynamically

---

#### C) Users Tab
**Steps:**
1. Click on "Users" tab
2. Search for a user
3. Click on user details button
4. See user information

**Expected Results:**
- ✅ Users list loads
- ✅ Can search by email/username
- ✅ User details modal opens
- ✅ User info displayed correctly
- ✅ Can suspend/unsuspend user
- ✅ Can reset user points
- ✅ Can delete user

**Test Cases:**
- [ ] Users load
- [ ] Search works
- [ ] Details modal opens
- [ ] All buttons functional
- [ ] Suspend works
- [ ] Points reset works
- [ ] Delete works with confirmation
- [ ] Analytics button shows user stats

---

#### D) Quizzes Tab
**Steps:**
1. Click on "Quizzes" tab
2. Click "Create Quiz"
3. Fill in quiz details
4. Add questions with options
5. Set correct answers
6. Save quiz

**Expected Results:**
- ✅ Can create new quiz
- ✅ Can add questions
- ✅ Can set correct answers
- ✅ Quiz saved to database
- ✅ Quiz visible in user quiz list

**Test Cases:**
- [ ] Quiz form appears
- [ ] Can add multiple questions
- [ ] Can set options (A/B/C/D)
- [ ] Can select correct answer
- [ ] Save creates quiz
- [ ] Quiz appears in list
- [ ] Can edit quiz
- [ ] Can duplicate quiz
- [ ] Can delete quiz with confirmation

---

#### E) Analytics Tab
**Steps:**
1. Click on "Analytics" tab
2. See quiz analytics

**Expected Results:**
- ✅ All quizzes displayed
- ✅ Attempt count shown
- ✅ Average score calculated
- ✅ Question difficulty shown
- ✅ Progress bars visualize difficulty

**Test Cases:**
- [ ] Analytics load
- [ ] Quiz data displays
- [ ] Attempt counts correct
- [ ] Average scores calculated
- [ ] Question stats show correctly
- [ ] Progress bars render

---

#### F) User Analytics Modal (NEW)
**Steps:**
1. Click on "Users" tab
2. Find a user
3. Click trending-up icon (analytics)
4. See user analytics modal

**Expected Results:**
- ✅ Modal opens with user info
- ✅ User quiz attempts listed
- ✅ Scores shown
- ✅ Points earned displayed
- ✅ Quiz details visible
- ✅ Referral stats shown

**Test Cases:**
- [ ] Analytics modal opens
- [ ] User stats display
- [ ] Quiz attempts list
- [ ] Scores correct
- [ ] Points accurate
- [ ] Dates show correctly
- [ ] Can close modal

---

#### G) Reports Tab
**Steps:**
1. Click on "Reports" tab
2. Click "Export Users"
3. Check downloaded JSON file

**Expected Results:**
- ✅ JSON file downloads
- ✅ Contains all user data
- ✅ Properly formatted
- ✅ Can be imported elsewhere

**Test Cases:**
- [ ] Export Users works
- [ ] Export Attempts works
- [ ] JSON valid format
- [ ] All data included
- [ ] Can read file

---

### 6️⃣ Responsive Design

#### A) Mobile View
**Steps:**
1. Open on mobile device or resize browser to <640px
2. Check all pages

**Expected Results:**
- ✅ Single-column layout
- ✅ All content readable
- ✅ Buttons clickable
- ✅ No horizontal scrolling
- ✅ Forms stack vertically

**Test Cases:**
- [ ] Home page responsive
- [ ] Login/Signup responsive
- [ ] Dashboard responsive
- [ ] Quiz layout responsive
- [ ] Admin dashboard responsive on mobile

---

#### B) Tablet View
**Steps:**
1. Resize browser to 640-1024px
2. Check layout

**Expected Results:**
- ✅ Two-column layout where applicable
- ✅ Content properly distributed
- ✅ No layout breaks

---

#### C) Desktop View
**Steps:**
1. Resize to >1024px
2. Check layout

**Expected Results:**
- ✅ Full-width layout
- ✅ Multi-column grids
- ✅ All features visible
- ✅ Smooth animations

---

### 7️⃣ Error Handling

#### A) Network Errors
**Steps:**
1. Disable internet connection
2. Try to perform action (login, quiz, etc.)

**Expected Results:**
- ✅ Graceful error message shown
- ✅ Can retry
- ✅ App doesn't crash

---

#### B) Invalid Data
**Steps:**
1. Try to submit invalid data
2. Try to access non-existent resources

**Expected Results:**
- ✅ Validation errors shown
- ✅ User guided to fix
- ✅ Clear error messages

---

#### C) Auth Errors
**Steps:**
1. Try to access `/dashboard` without login
2. Try to access `/admin` without admin password

**Expected Results:**
- ✅ Redirected to appropriate login page
- ✅ Can't bypass protection

---

---

## 📊 Performance Testing

### Load Testing
```
Recommended Tools: Lighthouse, WebPageTest, Apache JMeter

Key Metrics:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s
```

### Database Performance
- Quiz queries < 200ms
- User queries < 100ms
- Leaderboard queries < 500ms

---

## 🔒 Security Testing

### XSS Protection
- [ ] No unescaped user input
- [ ] All inputs sanitized
- [ ] No script execution possible

### CSRF Protection
- [ ] Token validation on POST/PUT/DELETE
- [ ] State changes require authentication

### SQL Injection
- [ ] Use parameterized queries (Mongoose)
- [ ] No direct string concatenation

### Password Security
- [ ] Passwords hashed with bcrypt
- [ ] Never stored in plaintext
- [ ] Reset tokens have expiry
- [ ] Hashed passwords salted

---

## 📋 Test Checklist

### Before Production
- [ ] All authentication flows tested
- [ ] All CRUD operations tested
- [ ] Responsive design verified
- [ ] Error handling working
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Database backups configured
- [ ] Environment variables set
- [ ] Admin password changed
- [ ] SSL/HTTPS enabled
- [ ] API rate limiting enabled
- [ ] CORS properly configured

### Regular Testing
- [ ] Weekly functionality tests
- [ ] Monthly security audits
- [ ] Performance monitoring
- [ ] Error log review
- [ ] User feedback collection

---

## 🐛 Bug Report Template

When you find an issue:

```
**Title:** Brief description
**Type:** Bug / Feature Request / Enhancement
**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**

**Actual Result:**

**Environment:**
- Browser: 
- OS: 
- Device: 

**Attachments:**
- Screenshots/videos if applicable

**Additional Notes:**
```

---

## ✨ Success Criteria

### Functionality
✅ All features work as documented
✅ No critical bugs
✅ Proper error handling
✅ Data persistence works

### Performance
✅ Page loads < 3 seconds
✅ Smooth animations
✅ No memory leaks
✅ Responsive on all devices

### Security
✅ No XSS vulnerabilities
✅ No CSRF vulnerabilities
✅ Passwords properly hashed
✅ JWT tokens valid
✅ Admin access protected

### User Experience
✅ Clear error messages
✅ Intuitive navigation
✅ Responsive design
✅ Professional appearance

---

## 📚 Testing Resources

- [Jest Testing Library](https://testing-library.com/)
- [React Testing Best Practices](https://react.dev/learn/react-testing)
- [OWASP Security Testing](https://owasp.org/www-project-web-security-testing-guide/)
- [Lighthouse Auditing](https://developers.google.com/web/tools/lighthouse)

---

## 🎯 Next Steps

After testing:
1. Document all findings
2. Fix critical bugs
3. Prepare for deployment
4. Set up monitoring
5. Plan ongoing maintenance

---

**Testing Status:** Ready for comprehensive testing
**Last Updated:** January 2, 2026
**Version:** 1.0.0
