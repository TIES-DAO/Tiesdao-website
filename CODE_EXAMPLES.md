# Code Examples - Mobile Responsive & Custom Modals

## ConfirmModal Component Usage

### Import
```javascript
import ConfirmModal from "../components/ConfirmModal";
```

### State Setup
```javascript
const [confirm, setConfirm] = useState({
  isOpen: false,
  action: null,
  data: null,
  title: "",
  message: "",
  type: "warning"
});
```

### Modal Rendering
```jsx
<ConfirmModal
  isOpen={confirm.isOpen}
  title={confirm.title}
  message={confirm.message}
  type={confirm.type}
  onConfirm={handleConfirm}
  onCancel={() => setConfirm({ isOpen: false, action: null, data: null })}
/>
```

---

## Modal Types & Examples

### 1. Delete Confirmation
```javascript
const deleteUser = async (userId) => {
  setConfirm({
    isOpen: true,
    action: "deleteUser",
    data: userId,
    title: "Delete User",
    message: "This action cannot be undone. All user data will be permanently deleted.",
    type: "delete",
  });
};

const handleDeleteUser = async (userId) => {
  try {
    await fetch(`${ADMIN}/users/${userId}`, {
      method: "DELETE",
      headers: auth(),
    });
    setUsers(users.filter(u => u._id !== userId));
    
    // Success modal
    setConfirm({
      isOpen: true,
      action: "success",
      type: "success",
      title: "Success",
      message: "User deleted successfully!",
      data: null,
    });
    setTimeout(() => setConfirm({ isOpen: false }), 1500);
  } catch (err) {
    // Error modal
    setConfirm({
      isOpen: true,
      action: "error",
      type: "warning",
      title: "Error",
      message: "Error deleting user",
      data: null,
    });
    setTimeout(() => setConfirm({ isOpen: false }), 2000);
  }
};
```

### 2. Warning Confirmation
```javascript
const resetPoints = async (userId) => {
  setConfirm({
    isOpen: true,
    action: "resetPoints",
    data: userId,
    title: "Reset Points",
    message: "All quiz and referral points will be set to zero. This cannot be undone.",
    type: "warning",
  });
};

const handleResetPoints = async (userId) => {
  try {
    await fetch(`${ADMIN}/users/${userId}/reset-points`, {
      method: "PATCH",
      headers: auth(),
    });
    loadAllData();
    
    setConfirm({
      isOpen: true,
      action: "success",
      type: "success",
      title: "Success",
      message: "Points reset successfully!",
      data: null,
    });
    setTimeout(() => {
      setConfirm({ isOpen: false });
      loadAllData();
    }, 1500);
  } catch (err) {
    setConfirm({
      isOpen: true,
      action: "error",
      type: "warning",
      title: "Error",
      message: "Error resetting points",
      data: null,
    });
    setTimeout(() => setConfirm({ isOpen: false }), 2000);
  }
};
```

### 3. Action Confirmation Handler
```javascript
const handleConfirm = async () => {
  if (!confirm.action) {
    setConfirm({ ...confirm, isOpen: false });
    return;
  }

  if (confirm.action === "deleteUser") {
    await handleDeleteUser(confirm.data);
  } else if (confirm.action === "deleteQuiz") {
    await handleDeleteQuiz(confirm.data);
  } else if (confirm.action === "resetPoints") {
    await handleResetPoints(confirm.data);
  }
};
```

---

## Responsive Design Patterns

### 1. Responsive Container
**Before:**
```jsx
<div className="p-6">
```

**After:**
```jsx
<div className="px-4 sm:px-6 py-6">
```

### 2. Responsive Grid
**Before:**
```jsx
<div className="grid md:grid-cols-4 gap-4">
```

**After:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
```

### 3. Responsive Flex Layout
**Before:**
```jsx
<div className="flex justify-between items-start">
```

**After:**
```jsx
<div className="flex flex-col sm:flex-row justify-between items-start gap-3">
```

### 4. Responsive Text
**Before:**
```jsx
<h4 className="font-bold text-lg">{username}</h4>
<p className="text-gray-400 text-sm">{email}</p>
```

**After:**
```jsx
<h4 className="font-bold text-base sm:text-lg">{username}</h4>
<p className="text-gray-400 text-xs sm:text-sm">{email}</p>
```

### 5. Responsive Icons
**Before:**
```jsx
<Icon size={18} />
```

**After:**
```jsx
<Icon size={16} className="sm:size-[18px]" />
```

### 6. Responsive Buttons
**Before:**
```jsx
<button className="px-6 py-3 rounded-xl">
  <Icon size={18} />
  Label
</button>
```

**After:**
```jsx
<button className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl">
  <Icon size={16} className="sm:size-[18px]" />
  <span className="hidden sm:inline">Label</span>
</button>
```

### 7. Responsive Spacing
**Before:**
```jsx
<div className="gap-4 p-6">
```

**After:**
```jsx
<div className="gap-2 sm:gap-4 p-4 sm:p-6">
```

---

## Stat Cards - Responsive Example

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
  {stats.map((stat, i) => (
    <motion.div
      key={i}
      className={`bg-gradient-to-br ${stat.color} p-4 sm:p-6 rounded-2xl border border-white/10`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/70 text-xs sm:text-sm font-semibold">
            {stat.label}
          </p>
          <p className="text-2xl sm:text-4xl font-black mt-2">
            {stat.value || 0}
          </p>
        </div>
        <IconComp size={24} className="sm:size-8" />
      </div>
    </motion.div>
  ))}
</div>
```

---

## User List - Responsive Example

```jsx
<div className="grid gap-4">
  {users.map((user) => (
    <motion.div
      key={user._id}
      className="bg-gradient-to-r from-white/5 to-white/10 p-4 sm:p-5 rounded-xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="flex-1 w-full">
          <h4 className="font-bold text-base sm:text-lg">
            {user.username}
          </h4>
          <p className="text-gray-400 text-xs sm:text-sm break-all">
            {user.email}
          </p>
          <div className="flex gap-2 sm:gap-4 mt-2 text-xs sm:text-sm flex-wrap">
            <span className="text-cyan-400">Quiz: {user.quizPoints} pts</span>
            <span className="text-green-400">Referral: {user.referralPoints} pts</span>
            <span className="text-yellow-400 font-bold">
              Total: {user.totalPoints} pts
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0 flex-wrap sm:flex-nowrap">
          <button className="p-2 rounded-lg transition">
            <BarChart3 size={16} className="sm:size-[18px]" />
          </button>
          <button className="p-2 rounded-lg transition">
            {suspended ? 
              <Unlock size={16} className="sm:size-[18px]" /> : 
              <Lock size={16} className="sm:size-[18px]" />
            }
          </button>
          <button className="p-2 rounded-lg transition">
            <RotateCcw size={16} className="sm:size-[18px]" />
          </button>
          <button className="p-2 rounded-lg transition">
            <Trash2 size={16} className="sm:size-[18px]" />
          </button>
        </div>
      </div>
    </motion.div>
  ))}
</div>
```

---

## Search Input - Responsive Example

```jsx
<div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-3 text-gray-400 size-5" />
    <input
      placeholder="Search by email or username..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm sm:text-base"
    />
  </div>
</div>
```

---

## Tab Navigation - Responsive Example

```jsx
<div className="mb-8 flex gap-2 overflow-x-auto pb-2">
  {tabs.map(tab => (
    <motion.button
      key={tab.id}
      className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold whitespace-nowrap backdrop-blur-lg border transition flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
        activeTab === tab.id
          ? "bg-gradient-to-r from-blue-600 to-cyan-600"
          : "bg-white/5"
      }`}
    >
      <tab.Icon size={16} className="sm:hidden" />
      <tab.Icon size={18} className="hidden sm:block" />
      <span className="hidden sm:inline">{tab.label}</span>
    </motion.button>
  ))}
</div>
```

---

## Common Responsive Classes

### Padding
- `px-4` (mobile)
- `sm:px-6` (tablet)
- `md:px-8` (desktop)

### Grid Columns
- `grid-cols-1` (mobile)
- `sm:grid-cols-2` (tablet)
- `md:grid-cols-4` (desktop)

### Text Size
- `text-xs` (mobile labels)
- `text-sm` (mobile body)
- `sm:text-base` (tablet+)
- `sm:text-lg` (tablet+ headings)

### Icon Size
- `size-4` (16px) mobile
- `sm:size-[18px]` (18px tablet+)
- `sm:size-8` (32px tablet+ large)

### Display
- `hidden` (hide on all)
- `sm:hidden` (hide on tablet+)
- `hidden sm:block` (show only on tablet+)
- `hidden sm:inline` (inline on tablet+)

### Layout
- `flex-col` (stack on mobile)
- `sm:flex-row` (side-by-side on tablet+)
- `flex-wrap` (wrap on mobile)
- `sm:flex-nowrap` (no wrap on tablet+)

### Spacing
- `gap-2` (mobile spacing)
- `sm:gap-3` or `sm:gap-4` (tablet spacing)
- `mt-3 sm:mt-0` (conditional margin)

---

## Best Practices

1. **Mobile First**: Always start with mobile styles, then add tablet/desktop
2. **Use Tailwind Prefixes**: `sm:`, `md:`, `lg:`, `xl:` for breakpoints
3. **Icon Sizing**: Use two sizes (16px mobile, 18px+ tablet)
4. **Text Sizing**: Use `text-sm` for mobile, `sm:text-base` for tablet
5. **Spacing**: Use smaller gaps on mobile, larger on tablet
6. **Flex Direction**: Stack on mobile, side-by-side on tablet
7. **Padding**: Use `px-4 sm:px-6` pattern for horizontal padding
8. **Hide/Show**: Use `hidden sm:block` to show on tablet+

---

## Testing on Mobile

### Chrome DevTools
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select "iPhone 12" (390x844)
4. Check layout at different widths

### Actual Devices
1. Find IP address: `ipconfig`
2. Visit: `http://192.168.x.x:5173` on phone
3. Test all breakpoints

### Breakpoints to Test
- 320px (small phone)
- 375px (iPhone SE)
- 640px (Tablet landscape)
- 768px (iPad)
- 1024px (Laptop)

---

## Performance Tips

1. **CSS-Only Animations**: Use Tailwind for basic animations
2. **Hardware Acceleration**: Use `transform` and `opacity` for animations
3. **Avoid Layout Shifts**: Set dimensions on responsive elements
4. **Optimize Images**: Use responsive images with srcset
5. **Lazy Load**: Load modals on demand
6. **CSS Modules**: Consider for large projects

---

Generated with ❤️ for the TIE-DAO Platform
