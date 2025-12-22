# Quick Start Guide - Hackathon Demo

## 🚀 Running Your Project

### Method 1: Development Server (Recommended for Demo)

```bash
# From project root
npm start
```

**Access at:** `http://localhost:3000/physical-ai-humanoid-book/`

**Note:** You may see a network interface warning in the terminal, but **the site will still work**. Just ignore the error and open your browser to the URL above.

---

### Method 2: Production Build (Backup)

If the development server has issues, use the production build:

```bash
# Build the site
npm run build

# Serve the production build
npm run serve
```

**Access at:** `http://localhost:3000/physical-ai-humanoid-book/`

---

## ⚡ Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies (first time only) |
| `npm start` | Start development server with hot reload |
| `npm run build` | Build production-ready static files |
| `npm run serve` | Serve production build locally |
| `npm run clear` | Clear cache if build issues occur |

---

## 🎯 Demo Checklist

Before your hackathon presentation:

1. **Terminal Setup**
   ```bash
   cd /root/home/physical-ai-humanoid-book
   npm start
   ```

2. **Wait for Success Message**
   Look for: `[SUCCESS] Docusaurus website is running at: http://localhost:3000/...`

3. **Open Browser**
   Navigate to: `http://localhost:3000/physical-ai-humanoid-book/`

4. **Verify Features**
   - [ ] Homepage loads
   - [ ] Curriculum sidebar visible
   - [ ] Language toggle works (English ↔ اردو)
   - [ ] Search icon visible
   - [ ] Dark mode toggle works
   - [ ] Navigation works (click through modules)

---

## 🐛 Troubleshooting

### Issue: "Port 3000 already in use"
```bash
# Kill process on port 3000
npx kill-port 3000

# Try again
npm start
```

### Issue: "Cannot find module" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: Build errors
```bash
# Clear cache and rebuild
npm run clear
npm run build
```

### Issue: Network interface warnings
**Solution:** Ignore them! The server still works. Just open your browser to `http://localhost:3000/physical-ai-humanoid-book/`

---

## 📁 Project File Structure

```
physical-ai-humanoid-book/
├── README.md                    ← Main project overview
├── HACKATHON_CHECKLIST.md       ← Feature completeness verification
├── DEMO_SCRIPT.md               ← 1-2 minute demo walkthrough
├── JUDGE_PITCH.md               ← Project descriptions for judges
├── QUICK_START.md               ← This file
├── package.json                 ← Root dependencies & scripts
└── website/                     ← Docusaurus site
    ├── docs/                    ← All documentation content
    ├── src/                     ← React components
    ├── static/                  ← Images, assets
    ├── i18n/                    ← Urdu translations
    ├── docusaurus.config.ts     ← Site configuration
    └── sidebars.ts              ← Navigation structure
```

---

## 🎬 Demo Day Instructions

### 30 Minutes Before
```bash
cd /root/home/physical-ai-humanoid-book
npm install  # Ensure dependencies are current
npm run build  # Create production build as backup
```

### 5 Minutes Before
```bash
npm start
# Wait for success message
# Open browser to http://localhost:3000/physical-ai-humanoid-book/
# Have DEMO_SCRIPT.md open on second monitor
```

### During Demo
- Use the **DEMO_SCRIPT.md** for guidance
- Show homepage → curriculum → language toggle → search → modules
- Speak confidently about the 7 modules and bilingual support
- Emphasize production-ready, open-source nature

### After Demo (Q&A)
- Refer to **JUDGE_PITCH.md** for talking points
- Highlight: 160M Urdu speakers, fragmented resources problem, modern tech stack
- Be prepared to show code quality (TypeScript, React, modular structure)

---

## 📊 Key Demo Talking Points

### Opening (15 sec)
> "Physical AI & Humanoid Robotics Book — a comprehensive, bilingual curriculum teaching developers to build intelligent humanoid robots."

### Features (30 sec)
> "7 progressive modules from ROS 2 to Vision-Language-Action models. Bilingual English-Urdu support. Full search, dark mode, modern tech stack."

### Impact (30 sec)
> "Solves fragmented learning in Physical AI. Structured path from basics to autonomous robots. Production-ready with Docusaurus, React, TypeScript."

### Close (15 sec)
> "Open source, MIT licensed, ready for community contributions. Thank you!"

---

## ✅ Pre-Demo Final Check

Run this verification:

```bash
cd /root/home/physical-ai-humanoid-book

# Check node version
node --version  # Should be ≥18.0

# Verify dependencies
npm list --depth=0

# Test build
npm run build

# Test dev server
npm start
```

If all pass: **You're ready! 🎉**

---

## 🆘 Emergency Contacts

- **Repository:** `https://github.com/your-username/physical-ai-humanoid-book`
- **Issues:** Create at repo issues page
- **Documentation:** All `.md` files in root directory

---

## 🏆 Good Luck!

You've built something impressive:
- ✅ 7 comprehensive modules
- ✅ 21+ chapters
- ✅ Bilingual support (English + Urdu)
- ✅ Production-ready infrastructure
- ✅ Open source (MIT)

**Show it with confidence!**
