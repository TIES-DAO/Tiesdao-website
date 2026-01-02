# 🔐 Password Reset Guide - Development Mode

## ❓ Why Don't I See the Reset Code in Email?

**Answer:** In **Development Mode**, the reset code is NOT sent via email. Instead, it's logged to the browser console for easy testing.

---

## 🎯 How to Get Your Reset Code

### Step 1: Open Browser Developer Tools
- **Windows/Linux:** Press `F12` or `Ctrl+Shift+I`
- **Mac:** Press `Cmd+Option+I`
- **Firefox:** Press `F12` or `Ctrl+Shift+I`

### Step 2: Go to Console Tab
1. You'll see several tabs: Elements, Console, Network, etc.
2. Click the **"Console"** tab
3. You should see a message like:
   ```
   [DEV] Reset code for user@example.com: 123456
   ```

### Step 3: Copy the Code
1. The code is the 6-digit number after the colon
2. Copy it (example: `123456`)
3. Paste it into the reset form

### Step 4: Complete Password Reset
1. Enter your new password
2. Confirm password
3. Click "Reset Password"
4. You'll be redirected to login
5. Login with your new password

---

## 📋 Complete Forgot Password Flow

```
1. Click "Forgot password?" on login page
   ↓
2. Enter your email address
   ↓
3. Click "Send Reset Code"
   ↓
4. Check console (F12 → Console)
   ↓
5. Copy the 6-digit reset code
   ↓
6. Paste code into the form
   ↓
7. Click "Verify Code"
   ↓
8. Enter new password (min 6 characters)
   ↓
9. Confirm password matches
   ↓
10. Click "Reset Password"
   ↓
11. Login with new password
```

---

## ⚙️ Development vs Production

### Development Mode (Current)
```javascript
// Reset code is logged to browser console
console.log(`[DEV] Reset code for ${email}: ${resetCode}`);

// Email is NOT sent
// Code is only in database (1-hour expiry)
```

### Production Mode (When Deployed)
```javascript
// Reset code would be sent via email service
sendEmailService.send({
  to: email,
  subject: "Password Reset Code",
  template: "resetCodeEmail",
  code: resetCode
});

// Code NOT logged to console (security)
```

---

## 🧪 Testing the Password Reset

### Test Case 1: Basic Password Reset
1. Create account: `test@example.com` / `password123`
2. Logout
3. Click "Forgot password?"
4. Enter `test@example.com`
5. Open console (F12)
6. Copy reset code
7. Enter code
8. Set new password: `newpassword456`
9. Login with `test@example.com` / `newpassword456`
✅ Should succeed

### Test Case 2: Wrong Code
1. Request reset for your email
2. Copy reset code
3. Intentionally type wrong code (e.g., change last digit)
4. Click "Verify Code"
❌ Should show error: "Invalid reset code"

### Test Case 3: Wrong Email
1. Click "Forgot password?"
2. Enter non-existent email: `notreal@example.com`
3. Click "Send Reset Code"
❌ Should show error: "Email not found"

### Test Case 4: Password Mismatch
1. Get reset code
2. Enter code
3. Password: `newpass123`
4. Confirm Password: `different456`
5. Click "Reset Password"
❌ Should show error: "Passwords do not match"

---

## 🛠️ Troubleshooting

### "I don't see the reset code in console"
**Solution:**
1. Make sure you opened the Console tab (not Elements/Network)
2. Check that you see the message starting with `[DEV]`
3. Try refreshing the page and requesting a new code
4. Check that "Send Reset Code" actually worked (you should see success message)

**Debug Steps:**
```javascript
// In console, type:
localStorage.getItem('adminToken') // Check if admin logged in
console.log(document.location) // Check current URL
```

### "Invalid reset code error"
**Possible Causes:**
1. Copied the wrong numbers
2. Code has expired (1-hour limit)
3. You're trying to reset a different account

**Solution:**
- Request a NEW reset code
- Copy it carefully
- Use it within 1 hour

### "Email not found"
**Cause:** Account doesn't exist with that email

**Solution:**
1. Check you're using the correct email
2. Try signup first if account doesn't exist
3. Verify email spelling

---

## 📝 Email Integration (For Production)

When deploying to production, you'll need to:

### Option 1: Using SendGrid
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: 'noreply@tiesdao.com',
  subject: 'Password Reset Code',
  html: `<p>Your reset code is: <strong>${resetCode}</strong></p><p>This code expires in 1 hour.</p>`
};

await sgMail.send(msg);
```

### Option 2: Using Nodemailer
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

await transporter.sendMail({
  from: 'noreply@tiesdao.com',
  to: email,
  subject: 'Password Reset Code',
  html: `<p>Your reset code is: <strong>${resetCode}</strong></p>`
});
```

### Option 3: Using AWS SES
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES();

await ses.sendEmail({
  Source: 'noreply@tiesdao.com',
  Destination: { ToAddresses: [email] },
  Message: {
    Subject: { Data: 'Password Reset Code' },
    Body: { Html: { Data: `Your reset code is: ${resetCode}` } }
  }
}).promise();
```

---

## 🔒 Security Notes

### For Development:
- ✅ Console logging is fine for testing
- ✅ Codes have 1-hour expiry
- ✅ Codes are stored in database (hashed would be better)
- ⚠️ Never push console logs to production

### For Production:
- ✅ Use email service to send codes
- ✅ Hash reset codes in database
- ✅ Implement rate limiting (max 3 requests per email per hour)
- ✅ Log all password reset attempts
- ✅ Use HTTPS only
- ✅ Implement CAPTCHA to prevent abuse

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| Forgot Password URL | `/forgot-password` |
| API Endpoint (Request) | `POST /api/auth/forgot-password` |
| API Endpoint (Reset) | `POST /api/auth/reset-password` |
| Code Format | 6 digits |
| Code Expiry | 1 hour |
| Dev Mode | Code logged to console |
| Production Mode | Code sent via email |
| Min Password Length | 6 characters |

---

## 📚 Related Files

- `src/Pages/ForgotPassword.jsx` - Frontend form
- `server/routes/auth.js` - Backend routes
- `server/controllers/authController.js` - Password reset logic
- `server/models/User.js` - Database fields

---

## 🎯 Next Steps

1. **Test forgot password** using the test cases above
2. **Set up email service** when ready for production
3. **Update environment variables** with email credentials
4. **Test in production** before deploying to users
5. **Monitor password reset** requests for abuse

---

**Last Updated:** January 2, 2026  
**Status:** ✅ Development Ready  
**Production:** ⏳ Requires Email Service Integration
