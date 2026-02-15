# 🏠 Personal Homepage

A beautiful, memory-optimized personal homepage with dynamic widgets, live search, and a modern glassmorphism UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)

## ✨ Features

### 🎨 Modern UI
- **Glassmorphism design** with backdrop blur effects
- **Dark theme** with purple gradient background
- **Responsive layout** optimized for mobile and desktop
- **Smooth animations** and hover effects

### ⏰ Time & Date
- Large digital clock display
- Current date with weekday
- Auto-updates every minute (memory efficient)

### 🌤️ Weather Widget
- Real-time weather data using geolocation
- Animated SVG weather icons (sun, rain, clouds, snow, etc.)
- Temperature display with location

### 🔍 Smart Search
- Live search suggestions like Google
- DuckDuckGo & Google autocomplete APIs
- Opens results in same tab
- Keyboard navigation support (ESC to close)

### 🎯 Productivity Widgets
- **Daily Focus** - Set your main goal for the day
- **Quick Note** - Temporary scratchpad (auto-saves)
- **Daily Quote** - Inspirational quotes that rotate daily
- **Quick Tasks** - Simple 5-item todo list
- **Mini Calendar** - Current month with today highlighted

### ⚙️ System Info
- Online/offline status indicator
- Battery level display (if supported by browser)
- Dark/Light theme toggle

### 🔗 Quick Access
- 6 customizable quick links with favicons
- Glassmorphism cards with hover effects
- YouTube, Gmail, Vercel, and more

## 🚀 Performance Optimizations

- **Memory efficient** - Minimal re-renders, optimized for long uptime
- **Time updates every minute** (not every second) to save CPU
- **Widgets hidden by default** - Click "Show Widgets" to display
- **LocalStorage persistence** - All data saved locally, no backend needed
- **Static export ready** - Can be deployed as static site

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Lucide React icons
- **Deployment:** Vercel-ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mysearchengine.git

# Navigate to project
cd mysearchengine

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
# Build static export
npm run build

# Deploy to Vercel
vercel --prod
```

## 🎨 Customization

### Quick Links
Edit the `quickLinks` array in `src/app/page.tsx`:

```typescript
const quickLinks = [
  { name: 'YouTube', url: 'https://youtube.com', favicon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64' },
  // Add your own links here
];
```

### Quotes
Add more quotes to the quotes array in the `useEffect` hook:

```typescript
const quotes = [
  { text: "Your quote here", author: "Author Name" },
];
```

### Colors
Modify Tailwind classes to change the color scheme:
- Background gradient: `from-slate-900 via-purple-900 to-slate-900`
- Accent colors: `purple-400`, `pink-400`

## 📱 Screenshots

*Add screenshots here*

## 🔧 Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers

> **Note:** Battery API requires Chrome/Edge and may need permission.

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 📄 License

MIT License - feel free to use this as your own homepage!

---

Made with ❤️ using Next.js & Tailwind CSS
