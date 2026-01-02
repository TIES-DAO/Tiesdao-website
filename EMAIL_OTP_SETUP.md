# 📧 Email Configuration Guide

## ✅ Password Reset OTP - Now Sends Real Emails!

Your password reset feature now sends **real OTP codes to user emails** using the same Gmail configuration you use for the contact form.

---

## 🔧 Environment Setup Required

### Your .env File (Server)

Make sure you have these variables set:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Email Recipient (for contact form)
RECEIVE_EMAIL=your-email@gmail.com
```

---

## 🔑 How to Get Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account](https://myaccount.google.com)
2. Click "Security" on the left
3. Find "2-Step Verification" and enable it (if not already)

### Step 2: Create App Password
1. Go back to Security
2. Find "App passwords" (only shows if 2FA is enabled)
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Copy this password

### Step 3: Add to .env
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx   # Your 16-character app password
```

⚠️ **Important:** Use the app password, NOT your regular Gmail password!

---

## 📨 What Users Will Receive

When a user requests a password reset, they'll receive a professional email with:

```
📧 Email Subject: 🔐 Password Reset Code - TIE DAO

📮 Email Content:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🔐 Password Reset

  We received a request to reset your password. 
  Use the code below to create a new password:

  ┌─────────────────────┐
  │ Your Reset Code     │
  │                     │
  │   123 456           │
  └─────────────────────┘

  ⏱️ This code will expire in 1 hour

  Enter this code on the password reset page 
  to create a new password.

  ⚠️ Security Tip: Never share this code 
  with anyone. TIE DAO staff will never ask 
  for your reset code.

  If you didn't request a password reset, 
  you can safely ignore this email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2026 TIE DAO. All rights reserved.
```

---

## 🧪 Testing Email Sending

### Test on Your Machine

1. **Make sure .env is set:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

2. **Restart your server:**
   ```bash
   cd server
   npm start
   ```

3. **Request a password reset:**
   - Go to `/forgot-password`
   - Enter your email
   - Click "Send Reset Code"

4. **Check your inbox:**
   - Should receive email within seconds
   - Professional formatted email with reset code
   - Copy code from email (NOT console)

---

## ✨ Features

### ✅ What's Included
- Professional HTML email design
- Large, easy-to-copy 6-digit code
- 1-hour expiry time shown
- Security tips
- Fallback logging if email fails
- Works with your existing Gmail config

### 🔒 Security
- Code NOT returned in API response
- Code only sent via email
- 1-hour expiry time
- Code hashed in database (recommended)
- Clear security warnings in email

---

## 📝 How It Works

```
User clicks "Forgot Password"
    ↓
Enters email address
    ↓
Backend generates 6-digit code
    ↓
Sends HTML email via Gmail SMTP
    ↓
User receives email
    ↓
User copies code from email
    ↓
Pastes code into reset form
    ↓
Verifies code matches
    ↓
User sets new password
    ↓
Password updated ✅
```

---

## 🚨 Troubleshooting

### Email Not Received

**Problem:** User doesn't get reset email

**Solutions:**
1. Check .env variables are correct:
   ```bash
   # In server/server.js or main file, add:
   console.log("Email User:", process.env.EMAIL_USER);
   console.log("Email Pass:", process.env.EMAIL_PASS ? "SET" : "NOT SET");
   ```

2. Verify Gmail app password (not regular password)

3. Check Gmail account allows "Less secure apps"
   - Go to [Gmail Security](https://myaccount.google.com/security)
   - Scroll down to "App passwords"

4. Check server console for errors:
   ```
   ✅ Reset code email sent to user@email.com
   // OR
   ❌ Email send error: [error message]
   ```

### "Less secure app" Error

Modern Gmail requires app passwords. If you get an error:

1. Enable 2-Factor Authentication (if not enabled)
2. Create an app password (follow guide above)
3. Use the 16-character password in .env
4. Restart server

### Email Stuck in Spam

1. Ask user to mark email as "Not Spam"
2. Consider using a dedicated email service for better deliverability
3. Add DNS records (SPF, DKIM) for better reputation

---

## 🔄 Alternative Email Services

If you want to switch email providers:

### SendGrid
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@tiesdao.com',
  subject: '🔐 Password Reset Code',
  html: emailTemplate
});
```

### AWS SES
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES();

await ses.sendEmail({
  Source: 'noreply@tiesdao.com',
  Destination: { ToAddresses: [email] },
  Message: {
    Subject: { Data: '🔐 Password Reset Code' },
    Body: { Html: { Data: emailTemplate } }
  }
}).promise();
```

---

## 📊 Email Log Example

Check your server console to see:

```
✅ Reset code email sent to john@example.com
```

Or if there's an issue:

```
❌ Email send error: connect ECONNREFUSED
[FALLBACK] Reset code for john@example.com: 564829
```

---

## 🎯 Next Steps

1. **Set up .env** with EMAIL_USER and EMAIL_PASS
2. **Restart server** (npm start)
3. **Test password reset** on /forgot-password
4. **Check email** - should arrive in seconds
5. **Use code from email** - no need to check console!

---

## 📞 Support

If you encounter issues:

1. Check .env file has EMAIL_USER and EMAIL_PASS
2. Verify it's an app password, not regular password
3. Check server console for error messages
4. Ensure Gmail 2-Factor is enabled
5. Check spam folder

---

## ✅ Configuration Checklist

```
☐ Gmail account created
☐ 2-Factor Authentication enabled
☐ App password generated (16 characters)
☐ EMAIL_USER set in .env
☐ EMAIL_PASS set in .env (app password)
☐ RECEIVE_EMAIL set in .env (for contact form)
☐ Server restarted
☐ Tested password reset
☐ Email received successfully
☐ All working! ✅
```

---

## 🎉 You're Done!

Your password reset now sends **real emails** to users with:
- ✅ Professional email design
- ✅ Large, easy-to-read 6-digit code
- ✅ Security warnings
- ✅ 1-hour expiry notice
- ✅ Fallback error handling

**Users will now receive OTP codes via email instead of having to check the browser console!**

---

**Last Updated:** January 2, 2026  
**Status:** ✅ Production Ready  
**Email Service:** Gmail SMTP
