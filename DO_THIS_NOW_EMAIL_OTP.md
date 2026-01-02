# ⚡ Do This Now - Real Email OTP Implementation

## 🎯 What You Need To Do (3 Steps)

### Step 1️⃣: Update Your .env File

**Location:** `server/.env`

**Add these lines (you probably already have them from contact form):**

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**How to get EMAIL_PASS:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security"
3. Scroll to "App passwords"
4. If you don't see "App passwords":
   - Enable "2-Step Verification" first
   - Then "App passwords" will appear
5. Select "Mail" → "Windows Computer"
6. Google gives you 16 characters (like: `xxxx xxxx xxxx xxxx`)
7. Copy this to .env as EMAIL_PASS

**Example .env:**
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_key_here
ADMIN_PASSWORD=TIE_DAO_ADMIN_2025
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
RECEIVE_EMAIL=your-email@gmail.com
PORT=5000
NODE_ENV=development
```

---

### Step 2️⃣: Restart Your Server

**In terminal:**

```bash
# Navigate to server folder
cd server

# Stop current server (Ctrl+C if running)

# Restart with new .env
npm start
```

**You should see:**
```
Server running on port 5000
```

---

### Step 3️⃣: Test It

**Test Password Reset Email:**

1. Open browser: `http://localhost:5173/forgot-password`

2. Enter your email address (same as EMAIL_USER in .env)

3. Click "Send Reset Code"

4. **Check your inbox** for email:
   - From: `TIE DAO <your-email@gmail.com>`
   - Subject: `🔐 Password Reset Code - TIE DAO`
   - Should arrive within seconds

5. Copy the 6-digit code from the email

6. Paste it into the form

7. Enter new password

8. Click "Reset Password"

9. Login with new password ✅

---

## ✅ That's All!

You're done! Now:
- Users get **real email codes** (not console)
- Professional **branded emails**
- **1-hour expiry** shown in email
- **Security warnings** included

---

## 🚨 Common Issues & Fixes

### Issue: "App passwords" doesn't appear

**Fix:** Enable 2-Step Verification first
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Find "2-Step Verification"
3. Click "Enable"
4. Now "App passwords" will appear

### Issue: Email won't send

**Fix:** Check error in server console
1. Look for lines like:
   ```
   ✅ Reset code email sent to user@email.com
   // OR
   ❌ Email send error: ...
   ```

2. If error, check:
   - EMAIL_USER is correct (your Gmail)
   - EMAIL_PASS is correct (16 characters from app passwords)
   - 2-Step Verification is enabled
   - Restart server after changing .env

### Issue: "Invalid credentials"

**Fix:** Verify you're using app password, not Gmail password
- Your Gmail password ❌
- App password (16 chars) ✅

Get app password from: [Google Account → Security → App passwords](https://myaccount.google.com/apppasswords)

---

## 📋 Checklist

Before testing, make sure:

```
☐ EMAIL_USER added to .env
☐ EMAIL_PASS added to .env (16-char app password)
☐ 2-Step Verification enabled on Google Account
☐ Server restarted (npm start)
☐ Server shows "Server running on port 5000"
☐ No errors in server console
☐ Ready to test!
```

---

## 🎯 Expected Results

When you test password reset:

✅ Email sent successfully message appears  
✅ Email arrives in inbox within seconds  
✅ Email has professional design with purple header  
✅ Email shows 6-digit code clearly  
✅ Code is easy to copy  
✅ Can paste code and complete reset  
✅ Can login with new password  

---

## 📞 Need Help?

If something doesn't work:

1. **Check server console** for error messages
2. **Verify .env** has EMAIL_USER and EMAIL_PASS
3. **Restart server** after .env changes
4. **Check Google Account** - 2FA must be enabled
5. **Check inbox spam folder** - email might be there
6. **See EMAIL_OTP_SETUP.md** for detailed help

---

**Ready?** Follow the 3 steps above! 🚀

It should take about **5 minutes total** (including email setup).

Once done, users will get **real emails** when they forget their password! 📧✅
