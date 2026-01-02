# 🎓 Getting Your Reset Code - Visual Guide

## 📌 Problem You're Having

You're seeing this message on the password reset page:

```
Check Console (Dev Mode)

Your reset code has been logged to the browser console. Copy it below.
```

And you're wondering: **"Where's my email with the code?"**

---

## ✅ Solution

The code is NOT in your email. It's in your **Browser Console**.

Here's how to find it:

---

## 🎬 Step-by-Step Guide

### Step 1: Open Developer Tools

**Press this key combination:**
- **Windows/Linux:** `F12` or `Ctrl + Shift + I`
- **Mac:** `Cmd + Option + I`
- **Firefox:** `F12`

**You'll see this appear at the bottom of your screen:**

```
┌─────────────────────────────────────────┐
│  Elements  Console  Network  ...        │
│                                         │
│  [DEV] Reset code for user@email.com:   │
│  123456                                 │
│                                         │
└─────────────────────────────────────────┘
```

### Step 2: Click "Console" Tab

You might see "Elements" tab open by default. Click the **"Console"** tab instead.

```
┌──────────────────────────────────────────┐
│  Elements  Console ← CLICK HERE  Network │
│                                          │
│ [DEV] Reset code for user@email.com:     │
│ 123456                                   │
│                                          │
└──────────────────────────────────────────┘
```

### Step 3: Find Your Reset Code

Look for a message that starts with **`[DEV]`**

You'll see:
```
[DEV] Reset code for user@email.com: 123456
```

The code is: **123456** (the 6-digit number)

### Step 4: Copy the Code

Select and copy the 6-digit number:
```
123456
```

### Step 5: Go Back to the Form

Switch back to your browser window and paste the code:

```
┌─────────────────────────────────────────┐
│  Reset Code (6 digits)                  │
│  ┌─────────────────────────────────────┐│
│  │ 123456                              ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Verify Code]                          │
└─────────────────────────────────────────┘
```

### Step 6: Enter Your New Password

After verifying the code, enter your new password:

```
┌─────────────────────────────────────────┐
│  New Password                           │
│  ┌─────────────────────────────────────┐│
│  │ ••••••••                            ││
│  └─────────────────────────────────────┘│
│                                         │
│  Confirm Password                       │
│  ┌─────────────────────────────────────┐│
│  │ ••••••••                            ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Reset Password]                       │
└─────────────────────────────────────────┘
```

### Step 7: Done!

You'll be redirected to login with your new password.

Login with your email and new password ✅

---

## 🎨 Visual Example

### What You'll See in Console:

```
┌────────────────────────────────────────────────────┐
│ Browser Console Output                             │
├────────────────────────────────────────────────────┤
│                                                    │
│ [DEV] Reset code for john@example.com: 564829    │
│                                                    │
│ <- This is your reset code: 564829               │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Checklist

```
☐ Clicked F12 to open Developer Tools
☐ Clicked "Console" tab
☐ Found message starting with [DEV]
☐ Copied the 6-digit code
☐ Pasted code into the form
☐ Entered new password
☐ Confirmed password matches
☐ Clicked "Reset Password"
☐ Logged in with new password
✅ Done!
```

---

## 📸 Browser Screenshots

### Chrome / Edge / Firefox

```
Opening DevTools:
┌─ Your Website ────────────────────────────────┐
│                                               │
│  Password Reset Form                          │
│  ┌───────────────────────────────────────┐   │
│  │ Reset Code: [    ]                    │   │
│  └───────────────────────────────────────┘   │
│                                               │
│  ┌─ Developer Tools (Press F12) ─────────┐   │
│  │ Elements Console Network ...          │   │
│  │ [DEV] Reset code: 123456              │   │
│  └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## ❓ Still Can't Find It?

### Try These Steps:

1. **Refresh the page:** Press `Ctrl+R` or `Cmd+R`
2. **Request a new code:** Click "Send Reset Code" again
3. **Check you're in Console tab:** Not "Elements" or "Network"
4. **Look for [DEV]:** The message must start with `[DEV]`
5. **Copy exactly:** Just the 6 digits, nothing else

---

## 💡 Why Is It in the Console?

### In Development Mode (Right Now):
- ✅ Code logged to Console for testing
- ✅ Easier to test without email setup
- ✅ Instant feedback
- ✅ Great for development

### In Production (When Deployed):
- ✅ Code sent via real email
- ✅ User receives in email inbox
- ✅ More secure
- ✅ Professional experience

---

## 🔒 Security Note

This is completely **normal and safe** for development mode.

**Development** = for testing (you use the console)
**Production** = for real users (they use email)

---

## 📞 Troubleshooting

### "I don't see any [DEV] message"

**Check:**
1. Did you click "Send Reset Code"? (should see success message)
2. Is Console tab open? (not Elements/Network)
3. Is the developer tools window visible? (not minimized)
4. Try requesting a new code
5. Press Ctrl+R to refresh

### "I see lots of messages, which one is mine?"

**Look for:**
- Message starting with `[DEV]`
- Your email address in the message
- A 6-digit number at the end

Example:
```
[DEV] Reset code for john@example.com: 564829
                    ↑ your email    ↑ your code
```

### "The code isn't working"

**Possible reasons:**
1. Copied the wrong code
2. Code expired (lasts 1 hour)
3. Typo in the code
4. Using wrong email

**Solution:** Request a new code and try again

---

## ✨ Pro Tips

- **Leave console open** while filling the form
- **Copy code immediately** before it expires
- **Check one more time** - codes look similar (0 vs O, 1 vs l)
- **Use Ctrl+C to copy** from console
- **Use Ctrl+V to paste** into form

---

## 🎯 Complete Flow Diagram

```
1. Go to /forgot-password page
   ↓
2. Enter your email
   ↓
3. Click "Send Reset Code"
   ↓
4. Success message appears
   ↓
5. Open Console (F12)
   ↓
6. Find [DEV] message with code
   ↓
7. Copy the 6-digit code
   ↓
8. Paste into form
   ↓
9. Click "Verify Code"
   ↓
10. Enter new password
    ↓
11. Confirm password
    ↓
12. Click "Reset Password"
    ↓
13. Redirected to login
    ↓
14. Login with new password ✅
```

---

## 📚 More Information

For more details, see:
- **PASSWORD_RESET_DEV_GUIDE.md** - Complete guide
- **ISSUES_FIXED_SUMMARY.md** - What was fixed
- **README.md** - Full documentation

---

**Ready to reset your password?** Follow the steps above! 🚀

**Need help?** Check the Troubleshooting section or the guides above.

**Last Updated:** January 2, 2026
