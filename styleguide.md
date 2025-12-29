# DocMatch Design System & Style Guide

**Version:** 1.0  
**Framework:** Tailwind CSS (v3.x) + Custom CSS  
**Theme:** Clinical, Clean, "Soft UI"  
**Font:** Inter (Google Fonts)

---

## 1. Brand Philosophy
The **DocMatch** interface is designed to be calming and trustworthy. It utilizes a "Soft UI" approach—characterized by generous whitespace, subtle blue tints, and diffused colored shadows—to reduce anxiety for patients entering symptoms.

*   **Primary Mood:** Professional, Clean, Reassuring.
*   **Visual Signature:** Rounded corners (`rounded-2xl/3xl`), soft blue glows, and "pop" micro-interactions.

---

## 2. Color Palette

The color system relies on the standard Tailwind **Slate** (Neutral) and **Blue** (Brand) scales.

### Primary Brand (Medical Blue)
Used for primary actions, focus rings, and active states.

| Class | Approx Hex | Usage |
| :--- | :--- | :--- |
| `bg-blue-600` | `#2563EB` | **Primary Buttons**, Active Links, Status Dots |
| `bg-blue-700` | `#1D4ED8` | **Hover States** for primary buttons |
| `text-blue-500` | `#3B82F6` | **Icons**, Accent Text |
| `bg-blue-50` | `#EFF6FF` | **Background Tints**, Pills, Badges |
| `border-blue-200` | `#BFDBFE` | **Subtle Borders** for cards/badges |

### Neutrals (Slate)
Used for text hierarchy, structure, and backgrounds.

| Class | Approx Hex | Usage |
| :--- | :--- | :--- |
| `bg-slate-900` | `#0F172A` | **Headings**, Dark Buttons, Modals |
| `text-slate-700` | `#334155` | **Primary Body Text** |
| `text-slate-500` | `#64748B` | **Secondary Text**, Descriptions |
| `text-slate-400` | `#94A3B8` | **Placeholders**, Meta Labels, Icons |
| `border-slate-200` | `#E2E8F0` | **Card Borders**, Dividers |
| `bg-slate-50` | `#F8FAFC` | **Page Background** (Canvas) |

### Semantic / Feedback
*   **Success:** `bg-green-500` (System Online status)
*   **Warning/Action:** `bg-orange-500` (Toast confirm actions)
*   **Focus Ring:** `ring-blue-500/10` (Very subtle blue halo)

---

## 3. Typography

**Font Family:** `'Inter', sans-serif`  
**Rendering:** `-webkit-font-smoothing: antialiased` (Enforced globally)

### Type Hierarchy

| Element | Size Class | Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `text-4xl` to `text-6xl` | `font-extrabold` (800) | `tracking-tight` | Main page greetings |
| **Section Title** | `text-xl` to `text-3xl` | `font-bold` (700) | `tracking-tight` | Dashboard headers, Modal titles |
| **Body Lead** | `text-lg` | `font-normal` (400) | Normal | Introduction paragraphs |
| **Body Standard** | `text-base` | `font-normal` (400) | Normal | Input text, general content |
| **Labels/Micro** | `text-xs` | `font-bold` (700) | `uppercase tracking-widest` | Form labels, status indicators |

---

## 4. UI Components

### Buttons & Interactivity

**1. Primary Action (Pill/Rounded)**
*   **Classes:** `bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all`
*   **Usage:** "Sign In", "Confirm Match", "Trigger Search".
*   **Behavior:** Features a "spring" effect (`active:scale-95`) when clicked.

**2. Secondary / Ghost**
*   **Classes:** `bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg`
*   **Usage:** "Cancel", "Log out".

**3. Icon Triggers**
*   **Classes:** `rounded-full hover:bg-slate-100 text-slate-400`
*   **Usage:** Microphone, Search settings.

### Inputs & Forms (The "Soft Focus" Style)
Inputs generally do not use sharp black outlines. They use a glow effect on focus.

*   **Default:** `border border-slate-200 bg-transparent`
*   **Focus:** `outline-none border-blue-500 ring-4 ring-blue-500/10`
*   **Radius:** `rounded-lg` (Standard) or `rounded-3xl` (Hero Inputs).

### Cards
*   **Background:** `bg-white`
*   **Border:** `border border-slate-200`
*   **Shadow:** `shadow-xl shadow-slate-200/40`
    *   *Note:* The shadow is colored (`slate-200`), not black, creating a softer depth.

### Badges / Pills
*   **Classes:** `bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 text-xs font-bold`
*   **Usage:** Displaying specialties ("Cardiology"), status ("Database Ready").

---

## 5. Effects & Animation

### Transitions
*   **Global Hover:** `transition-all duration-150 ease-out`
*   **Page Load:** Custom `.fade-in` class (0.2s translateY + Opacity).

### Modals
*   **Backdrop:** `backdrop-blur-sm bg-slate-900/40`
*   **Animation:** `animate-in zoom-in-95` (Subtle scaling entrance).

### Custom Scrollbar
Overrides default browser scrollbars to match the slate/blue theme.
*   **Width:** 8px
*   **Thumb:** `#cbd5e1` (Slate-300) with full rounding.
*   **Hover:** `#3b82f6` (Blue-500).

---

## 6. Layout Grid
*   **Container:** `max-w-6xl mx-auto px-6`
*   **Responsive Grid:**
    *   Mobile: `grid-cols-1`
    *   Tablet: `md:grid-cols-2`
    *   Desktop: `lg:grid-cols-3`
    *   Gap: `gap-6`

---

## 7. Icons
**Library:** FontAwesome 6.4.0 (`fa-solid`, `fa-regular`)

*   **Primary Icons:** Used for navigation and actions (`fa-microphone`, `fa-arrow-up`, `fa-user-md`).
*   **Visual Logic:** Icons usually sit inside `w-8 h-8` or `w-10 h-10` containers that are centered using flexbox (`flex items-center justify-center`).

---

## 8. Code Snippets

### Standard Card
```html
<div class="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 p-6 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
    <h3 class="text-xl font-bold text-slate-900">Card Title</h3>
    <p class="text-slate-500 mt-2">Card content goes here.</p>
</div>

### Primary Button
```html
<button class="h-11 px-6 inline-flex items-center justify-center rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all">
    Confirm Action
</button>
```
  

### Form Field (Label + Input)
```html
<div class="space-y-2">
    <label class="text-xs font-bold uppercase text-slate-400 tracking-wide">
        Full Name
    </label>
    <input type="text" placeholder="Enter name" 
        class="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all">
</div>
```
  

### Toast Notification
```html
<div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-lg">
    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <i class="fas fa-check text-sm"></i>
    </div>
    <div>
        <h4 class="text-sm font-bold text-slate-900">Success</h4>
        <p class="text-xs text-slate-500">Operation completed.</p>
    </div>
</div>
```

  