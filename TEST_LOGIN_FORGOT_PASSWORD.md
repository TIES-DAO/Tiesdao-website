# 🧪 Testing Login & Forgot Password Flow

## ✅ Your Current Setup

```env
EMAIL_USER=plutoxofweb3@gmail.com      ✅
EMAIL_PASS=xcsk vckf gxfo ocxu         ✅
MONGO_URI=configured                    ✅
JWT_SECRET=configured                   ✅
FRONTEND_URL=configured                 ✅
```

**Status:** All credentials ready! ✅

---

## 🚀 Start Here: Run the Servers

### Terminal 1: Start Backend
```bash
cd server
npm start
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Server running on port 5000
✅ Email configured (nodemailer ready)
```

### Terminal 2: Start Frontend
```bash
npm run dev
```

**Expected Output:**
```
✅ Vite dev server running on http://localhost:5173
```

---

## 📋 Testing Checklist

### Part 1: Test Sign Up (Create Test Account)

1. **Go to:** `http://localhost:5173/register`
2. **Fill form:**
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Name: `Test User`
3. **Click:** "Register"
4. **Expected:**
   - ✅ Account created
   - ✅ Redirected to login page
   - ✅ Success message shown

**Check Server Console:**
```
✅ User created successfully
✅ Email: test@example.com
```

---

### Part 2: Test Login (Basic Flow)

1. **Go to:** `http://localhost:5173/login`
2. **Enter:**
   - Email: `test@example.com`
   - Password: `TestPassword123!`
3. **Click:** "Login"
4. **Expected:**
   - ✅ Redirected to dashboard
   - ✅ "Welcome back!" message
   - ✅ Can see user profile
   - ✅ JWT token saved in localStorage

**Check Server Console:**
```
✅ Login successful
✅ JWT token generated
```

**Check Browser DevTools:**
- Press `F12` → Console
- Type: `localStorage.getItem('token')`
- Should show: Long token string ✅

---

### Part 3: Test Logout

1. **In Dashboard:** Click profile menu
2. **Click:** "Logout"
3. **Expected:**
   - ✅ Redirected to home page
   - ✅ Token removed from localStorage
   - ✅ Login button visible

**Verify in Console:**
- Type: `localStorage.getItem('token')`
- Should show: `null` ✅

---

### Part 4: Test Login with Wrong Password

1. **Go to:** `http://localhost:5173/login`
2. **Enter:**
   - Email: `test@example.com`
   - Password: `WrongPassword123!`
3. **Click:** "Login"
4. **Expected:**
   - ❌ Error message shown
   - ❌ "Invalid credentials"
   - ❌ Stay on login page
   - ❌ No token created

---

### Part 5: Test Forgot Password - Step 1 (Request Code)

1. **Go to:** `http://localhost:5173/forgot-password`
2. **Enter Email:**
   - Email: `plutoxofweb3@gmail.com` (or your email)
3. **Click:** "Send Reset Code"
4. **Expected:**
   - ✅ Success message: "Reset code sent to your email!"
   - ✅ UI changes to Step 2 (Code entry)
   - ✅ Green checkmark shown

**Check Server Console:**
```
✅ Reset code email sent to: plutoxofweb3@gmail.com
```

**Check Your Email:**
- ✅ Email from "TIE DAO" received
- ✅ Subject: "🔐 Password Reset Code - TIE DAO"
- ✅ Has 6-digit code (e.g., `847291`)
- ✅ Shows 1-hour expiry
- ✅ Professional design

---

### Part 6: Test Forgot Password - Step 2 (Enter Code)

1. **Copy Code:** From email
2. **Go to:** `/forgot-password` (Step 2)
3. **Paste Code:** Into "Reset Code" field
   - Example: `847291`
4. **Click:** "Verify Code"
5. **Expected:**
   - ✅ Green checkmark shown
   - ✅ Code accepted
   - ✅ UI changes to Step 3 (Password)

**If Code is Invalid:**
- ❌ Error message: "Invalid or expired code"
- ❌ Cannot proceed

**Server Console:**
```
✅ Reset code validated
```

---

### Part 7: Test Forgot Password - Step 3 (Set New Password)

1. **At Step 3:** "Enter Your New Password"
2. **Fill:**
   - New Password: `NewPassword123!`
   - Confirm: `NewPassword123!`
3. **Click:** "Reset Password"
4. **Expected:**
   - ✅ "Password reset successfully!"
   - ✅ Redirected to login page
   - ✅ Code is now invalid (one-time use)

**Check Server Console:**
```
✅ Password reset successfully for: test@example.com
```

---

### Part 8: Test Login with New Password

1. **Go to:** `http://localhost:5173/login`
2. **Enter:**
   - Email: `test@example.com`
   - Password: `NewPassword123!` (the new one)
3. **Click:** "Login"
4. **Expected:**
   - ✅ Login successful
   - ✅ Dashboard loads
   - ✅ Welcome message shown

**Try Old Password:**
- Ensure old password no longer works
- Should show: "Invalid credentials"

---

## 🔍 Email Testing Details

### Email Should Look Like:
```
FROM: TIE DAO <plutoxofweb3@gmail.com>
TO: your-email@example.com
SUBJECT: 🔐 Password Reset Code - TIE DAO

BODY:
- TIE DAO Logo/Branding
- "Password Reset Request"
- Large 6-digit code box (e.g., 8 4 7 2 9 1)
- "This code expires in 1 hour"
- Security warning: "Never share this code"
- Support info
```

### Common Email Issues:

**📧 Email Not Received?**
1. Check spam/junk folder
2. Wait 2-3 minutes
3. Check server console for errors:
   ```
   ❌ Email send error: ...
   ```
4. Verify EMAIL_USER and EMAIL_PASS in .env

**⏰ Code Expired?**
- Codes expire in 1 hour
- If expired: Request new code
- Server validates: resetPasswordExpiry timestamp

**🔐 Code Not Accepted?**
- Ensure you copied exactly
- Check case sensitivity (codes are case-insensitive)
- Try requesting new code

---

## 📊 Testing Summary Table

| Test | Expected | Status |
|------|----------|--------|
| Sign Up | Account created | ✅ |
| Login (correct) | Dashboard loads | ✅ |
| Login (wrong pw) | Error shown | ✅ |
| Logout | Token removed | ✅ |
| Forgot Pass - Step 1 | Email received | ✅ |
| Forgot Pass - Step 2 | Code validated | ✅ |
| Forgot Pass - Step 3 | Password reset | ✅ |
| New Login | Works with new pw | ✅ |

---

## 🛠️ Debugging Commands

### Check if Backend is Running:
```bash
curl http://localhost:5000/api/auth/health
```

**Expected Response:**
```json
{ "status": "ok" }
```

### Check if MongoDB is Connected:
In server console, look for:
```
✅ Connected to MongoDB at cluster0.xnpc9ix.mongodb.net
```

### Check Email Configuration:
In server console during forgot password request:
```
✅ Reset code email sent to: user@example.com
```

### Check localStorage (Browser Console):
```javascript
// Should have token after login
localStorage.getItem('token')
// Should be null after logout
localStorage.getItem('token')
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot GET /login"
**Solution:**
- Frontend not running
- Run: `npm run dev`
- Check: http://localhost:5173

### Issue 2: "Connection refused" (Backend)
**Solution:**
- Backend not running
- Run: `cd server && npm start`
- Check port: 5000

### Issue 3: Email Not Received
**Solution:**
1. Check spam folder
2. Verify EMAIL_USER in .env
3. Verify EMAIL_PASS in .env (16 chars with spaces)
4. Check server console for errors
5. Wait 2-3 minutes

### Issue 4: "Invalid Credentials" When Login Should Work
**Solution:**
- Check password hasn't changed
- Account might not exist
- Try signup again
- Check MongoDB connection

### Issue 5: Code Validation Fails
**Solution:**
- Copy code exactly from email
- Code expires in 1 hour (request new)
- Check for typos (numbers can look similar)

---

## 📱 Test Different Browsers

Try login/forgot password in:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if on Mac)

All should work identically.

---

## 📝 Test Script (For Easy Verification)

**Copy this test sequence:**

```
1. Open http://localhost:5173/register
2. Sign up with: test@example.com / TestPassword123!
3. Go to http://localhost:5173/login
4. Login with: test@example.com / TestPassword123!
5. Verify dashboard loads
6. Click logout
7. Go to http://localhost:5173/forgot-password
8. Enter email: test@example.com
9. Check email inbox for code
10. Copy code and paste into form
11. Enter new password: NewPassword123!
12. Login with new password
```

---

## ✅ Final Verification

After testing all steps, you should have:

```
✅ Sign up working
✅ Login working (correct credentials)
✅ Login validation working (wrong credentials rejected)
✅ Logout working
✅ Tokens stored/removed correctly
✅ Forgot password request working
✅ Emails received successfully
✅ Code validation working
✅ Password reset working
✅ New login working with new password
```

---

## 🎉 If All Tests Pass

**Congratulations! Your authentication system is working perfectly:**

✅ Sign up → Login → Logout  
✅ Password reset with email OTP  
✅ Token management  
✅ Error handling  
✅ Email delivery  
✅ Security measures  

**You're ready for production deployment!** 🚀

---

## 📞 Need Help?

**Check these files:**
- Email setup: `EMAIL_OTP_SETUP.md`
- Frontend routes: `src/Pages/login.jsx`
- Backend auth: `server/controllers/authController.js`
- Forgot password: `src/Pages/ForgotPassword.jsx`

---

**Status:** Ready to test ✅  
**Expected Time:** ~15 minutes  
**Difficulty:** Easy ✅
