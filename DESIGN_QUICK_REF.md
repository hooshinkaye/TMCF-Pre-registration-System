# Quick Reference: Modern Educational Playfulness Design System

## Color Usage Quick Tips

```jsx
// Primary CTAs - Use these for main actions
className="bg-gradient-to-r from-blue-600 to-purple-600"  // .btn-primary

// Secondary actions
className="border-2 border-slate-300 text-slate-900"  // .btn-secondary

// Cards & containers
className="glass-card"  // glassmorphic effect

// Success states
className="text-green-600"  // checkmarks, confirmations

// Error states
className="text-red-600"  // validation errors

// Text hierarchy
className="text-slate-900"  // primary text
className="text-slate-700"  // secondary text
className="text-slate-500"  // muted text
```

## Responsive Grid Patterns

```jsx
// Mobile-first default: single column
// Tablet+: 2 columns
// Desktop+: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Form: 1 column mobile, 2 desktop
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <Input /> {/* full width on mobile */}
  <Input /> {/* half width on desktop */}
</div>
```

## Animation Patterns

```jsx
// Fade & slide up on entry
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// Staggered children
<motion.div
  variants={{
    container: { staggerChildren: 0.1 },
    item: { opacity: 1, y: 0 }
  }}
  initial="hidden"
  animate="visible"
>

// Hover scale
<motion.button
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
>
```

## Form Patterns

```jsx
// Required fields - add *
<Label>First Name *</Label>

// Error display
{errors.fieldName && <p className="form-error">{errors.fieldName}</p>}

// Input styling
<Input className="form-input" />  // Auto handles focus states

// Select styling
<select className="form-select">
  <option>Option</option>
</select>

// Checkbox styling
<Checkbox id="field" checked={bool} onChange={(checked) => {}} />
```

## Component Templates

### Glass Card
```jsx
<div className="glass-card">
  <h3 className="text-lg font-bold text-slate-900">Title</h3>
  <p className="text-slate-600">Content</p>
</div>
```

### Button Pair
```jsx
<div className="flex gap-3">
  <button className="btn btn-secondary flex-shrink-0">
    <ChevronLeft className="w-5 h-5" />
    Back
  </button>
  <button className="btn btn-primary flex-1">
    Next
    <ChevronRight className="w-5 h-5" />
  </button>
</div>
```

### Hero Section
```jsx
<section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

### Responsive Image Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Item content */}
    </motion.div>
  ))}
</div>
```

## Typography Scale

```
H1: text-3xl sm:text-4xl lg:text-5xl font-black
H2: text-2xl sm:text-3xl lg:text-4xl font-bold
H3: text-xl sm:text-2xl font-bold
H4: text-lg font-bold
Body: text-base font-normal
Small: text-sm font-normal
Tiny: text-xs font-normal
```

## Spacing Utilities

```
Padding:
p-4 = 1rem (16px)      // Default spacing
p-6 = 1.5rem (24px)    // Larger components
p-8 = 2rem (32px)      // Sections

Gap (flex/grid):
gap-3 = 0.75rem (12px) // Tight
gap-4 = 1rem (16px)    // Standard
gap-6 = 1.5rem (24px)  // Loose
```

## Mobile-First Checklist

- [ ] Test at 375px viewport
- [ ] Touch targets 44px× minimum
- [ ] Text readable at 16px (no zoom needed)
- [ ] Single column by default
- [ ] Two-column at md: (768px)
- [ ] Hamburger menu on mobile
- [ ] Full width buttons on mobile
- [ ] Adequate padding around interactive elements
- [ ] No horizontal scroll
- [ ] Image sizes responsive

## Icon Usage (lucide-react)

```jsx
import { 
  ChevronRight,    // Navigation
  CheckCircle,     // Success
  AlertCircle,     // Warning
  Camera,          // Upload
  MapPin,          // Location
  User,            // Profile
  Lock,            // Security
  Info,            // Information
  Eye, EyeOff,     // Visibility
  Sparkles,        // Premium/new
  Users,           // Team/community
  Zap,             // Energy/speed
  BookOpen,        // Learning
} from 'lucide-react';

// Icon sizing
<Icon className="w-4 h-4" />  // Inline icon
<Icon className="w-6 h-6" />  // Button icon
<Icon className="w-8 h-8" />  // Large/hero icon
```

## Common Patterns

### Loading State
```jsx
<button disabled={loading} className="btn btn-primary">
  {loading ? 'Loading...' : 'Submit'}
</button>
```

### Error Display
```jsx
{errors.submit && (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
    <p className="text-sm text-red-900">{errors.submit}</p>
  </div>
)}
```

### Info Box
```jsx
<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
  <div className="flex gap-3">
    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-blue-900">Important information here</p>
  </div>
</div>
```

### Conditional Rendering
```jsx
{isSuccess ? (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-8"
  >
    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
    <p className="text-lg font-bold text-slate-900">Success!</p>
  </motion.div>
) : (
  /* Regular content */
)}
```

## CSS Variables Reference

Access these in custom CSS:
```css
/* Colors */
var(--primary)         /* #6366F1 */
var(--secondary)       /* #EC4899 */
var(--accent)          /* #F97316 */
var(--success)         /* #10B981 */
var(--error)           /* #DC2626 */

/* Spacing */
var(--spacing-xs)      /* 0.25rem */
var(--spacing-md)      /* 1rem */
var(--spacing-lg)      /* 1.5rem */

/* Border Radius */
var(--radius-md)       /* 0.75rem */
var(--radius-lg)       /* 1.25rem */
var(--radius-xl)       /* 1.875rem */

/* Shadows */
var(--shadow-lg)       /* 0 10px 15px -3px rgba(0,0,0,0.1) */

/* Transitions */
var(--transition-fast)  /* 150ms */
var(--transition-base)  /* 250ms */
```

---

## Testing Tips

### Mobile Testing
```bash
# Chrome DevTools: Toggle device toolbar (Ctrl+Shift+M)
# Test these viewports:
# - 375px (iPhone SE)
# - 414px (iPhone 12)
# - 768px (iPad)
# - 1024px (iPad Pro)

# Test zoom levels: 100%, 125%, 150%
```

### Keyboard Navigation
- Tab through all interactive elements
- Shift+Tab to go backwards
- Enter to activate buttons
- Space to toggle checkboxes
- Arrow keys in dropdowns

### Performance
```bash
npm run build  # Check bundle size
npm run dev    # Test locally first
```

---

**Last Updated**: Phase 2 Radical Redesign
**Design Lead**: Visual Design System v1.0
**Status**: ✅ Production Ready
