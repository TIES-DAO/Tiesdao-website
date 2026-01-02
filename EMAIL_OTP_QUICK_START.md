# 📧 Real Email OTP Setup - Quick Start

## ✅ What Changed

Your password reset feature now **sends real OTP codes to user emails** instead of logging to console!

---

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Your Email Credentials

You already have these from your contact form! Add to `.env` in the `server/` folder:

```env
# Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx   # Your 16-char app password

# (You probably already have these)
RECEIVE_EMAIL=your-email@gmail.com
```

⚠️ **Important:** `EMAIL_PASS` must be your **Google App Password**, NOT your regular Gmail password!

### Step 2: Create Google App Password (if you don't have one)

1. Go to [Google Account](https://myaccount.google.com)
2. Click "Security" (left menu)
3. Enable "2-Step Verification" (if not already enabled)
4. Find "App passwords"
5. Select "Mail" → "Windows Computer"
6. Google gives you 16 characters
7. Copy it to `.env` as `EMAIL_PASS`

### Step 3: Restart Your Server

```bash
cd server
npm start
```

---

## 🧪 Test It Now

### Test Steps:

1. **Go to password reset:**
   - Navigate to `http://localhost:5173/forgot-password`

2. **Enter your email:**
   - Use the same email from your .env
   - Click "Send Reset Code"

3. **Check your email:**
   - Open your inbox
   - Look for email from TIE DAO
   - Subject: "🔐 Password Reset Code - TIE DAO"
   - Copy the 6-digit code

4. **Complete reset:**
   - Paste the code into the form
   - Enter new password
   - Click "Reset Password"
   - Login with new password ✅

---

## 📧 What Users Will See

### Email They Receive:

```
FROM: TIE DAO <your-email@gmail.com>
SUBJECT: 🔐 Password Reset Code - TIE DAO

┌─────────────────────────────────────────┐
│  🔐 Password Reset                      │
│                                         │
│  We received a request to reset your    │
│  password. Use the code below:          │
│                                         │
│  ┌───────────────────┐                 │
│  │ Your Reset Code   │                 │
│  │                   │                 │
│  │   1 2 3  4 5 6    │                 │
│  └───────────────────┘                 │
│                                         │
│  ⏱️ This code expires in 1 hour         │
│                                         │
│  ⚠️ Never share this code               │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✨ Features

✅ **Professional HTML email** with branded design  
✅ **Large, easy-to-read code** (6 digits)  
✅ **Security warnings** in email  
✅ **Expiry timer** shown (1 hour)  
✅ **Fallback logging** if email fails  
✅ **Uses your Gmail config** (no new setup needed)  

---

## 🔍 Troubleshooting

### Email not received?

**1. Check .env is set correctly:**
```bash
# In server folder, verify .env has:
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

**2. Check server console for errors:**
```
✅ Reset code email sent to user@email.com
// OR
❌ Email send error: [error details]
```

**3. Check it's an app password:**
- NOT your regular Gmail password
- Should be 16 characters with spaces
- Get from [Google Account → Security → App passwords](https://myaccount.google.com/apppasswords)

**4. Gmail app passwords need 2FA enabled:**
- Go to Security settings
- Enable 2-Step Verification first
- Then app passwords will appear

### Still stuck?

See **EMAIL_OTP_SETUP.md** for detailed troubleshooting

---

## 📝 .env Example

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/tiesdao

# Auth
JWT_SECRET=your_super_secret_key_12345
ADMIN_PASSWORD=TIE_DAO_ADMIN_2025

# Email Configuration (Gmail SMTP)
EMAIL_USER=john@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
RECEIVE_EMAIL=john@gmail.com

# Server
PORT=5000
NODE_ENV=development
```

---

## 🎯 Now You Have:

| Feature | Status |
|---------|--------|
| Email OTP | ✅ Real emails sent |
| Professional design | ✅ Branded template |
| 1-hour expiry | ✅ Security timer |
| Fallback logging | ✅ Error handling |
| Gmail integration | ✅ Using your existing config |

---

## 🚀 That's It!

You're done! Your password reset now sends real emails to users.

**Next time a user forgets their password:**
1. They request reset
2. Get email with code
3. Use code to reset password
4. Done! ✅

---

## 📚 More Info

See these files for details:
- **EMAIL_OTP_SETUP.md** - Complete setup guide
- **ISSUES_FIXED_SUMMARY.md** - All fixes made
- **README.md** - General documentation

---

**Status:** ✅ **Ready to Use**  
**Setup Time:** ~2 minutes  
**Testing:** ~1 minute  
**Email Service:** Gmail SMTP (your existing config)
