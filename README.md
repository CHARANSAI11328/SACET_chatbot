# 🏛️ St. Ann's College of Engineering & Technology (SACET) — AI Campus Portal

A modern, responsive, university-grade collegiate web portal and AI Campus Counselor for **St. Ann's College of Engineering & Technology (SACET), Chirala (AP EAMCET Code: SACE)**. Powered by **Alibaba Qwen 2.5 72B Instruct** via a secure server proxy and grounded in **100% verified authentic institutional data scraped directly from `sacet.ac.in`**.

---

## 🌟 Key Architectural Features

1. **🔒 Zero Client-Side API Key Exposure**:
   - The secret OpenRouter API key is stored strictly on the backend (`.env` or hosting environment variables).
   - Visitors and browser DevTools inspect element can **never** see or extract your API key.
   - Client sends requests to `/api/chat`, which is authenticated and forwarded by the Node.js server.

2. **100% Truthful Grounding (Zero Hallucination RAG)**:
   - Grounded in official records scraped directly from `sacet.ac.in` (all 127 pages & 130 circulars).
   - **AFRC Mandated Tuition Fees:** B.Tech: ₹56,800/yr | MBA/MCA: ₹35,000/yr | 100% JVD fee reimbursement.
   - **All Verified Department HODs:** 
     - Data Science: **Dr. S. Ganesh Babu, Ph.D.** (Joined 15-07-2024)
     - AI & ML: **Dr. Hari Kishan Chapala, Ph.D.**
     - Cyber Security: **Dr. V. Venu Gopal, Ph.D.**
     - IoT: **Dr. Sreeram Indraneel, Ph.D.**
     - CSE Core: **Dr. P. Harini, Ph.D.**
     - ECE: **Dr. D. Rajendra Prasad, Ph.D.**
     - EEE: **Dr. S. Venkat Durga Anil Kumar, Ph.D.**
     - Mechanical: **Dr. Lakshmi Tulasi Chavali, Ph.D.**
     - Civil: **Dr. Tappeta Kiran Kumar, Ph.D.**
     - MBA: **Dr. Ramanadhula Emmanuel, Ph.D.**
     - MCA: **Dr. D. Reddeppa, Ph.D.**
   - **TPO Contact:** Mr. N. Purna Chandra Rao (📞 `09866031363` / `09160736444`) | ₹12.5 LPA top package.
   - **Live 2026 Bulletins:** NCC CATC-I Camp, PACE Festino Champions, Ramsur Drone MoU, APSSDC Workshops.

3. **Claude-Inspired UI Aesthetic**:
   - Warm stone & ivory palette (`#FAF9F5`), refined espresso ink (`#1C1917`), and terracotta coral accents (`#CC5A36`).
   - Editorial typography pairing: **Newsreader** serif + **Plus Jakarta Sans** + **JetBrains Mono**.
   - Floating chat counselor card with formatted Markdown tables, blockquotes, copy-to-clipboard, voice speech input, and audio text-to-speech readback.

---

## 🚀 Running Locally

```bash
# 1. Navigate to the folder
cd college_web

# 2. Run the secure Node server
node server.js
```
Open **`http://localhost:3000/`** in your browser.

---

## ☁️ Deploying to GitHub & Making It Live Online

### ⚠️ Will It Work Directly on GitHub Pages?

> [!WARNING]
> **No, GitHub Pages alone cannot run the chatbot backend.**
> 
> - **GitHub Pages** only hosts **static files** (HTML, CSS, static JS). It **cannot run a Node.js server** (`node server.js`).
> - Because our chatbot uses `server.js` to protect your secret API key and process `/api/chat` requests, a static GitHub Pages site would give a **404 error** on chat messages.
> - Furthermore, **never push `.env` to GitHub** because your secret API key would become public!

---

### 🌐 The 2 Best Free Ways to Make It 100% Live

Both options below connect directly to your GitHub repository and provide a free, live HTTPS link (e.g. `https://sacet-college.onrender.com` or `https://sacet-college.vercel.app`) where **both the website and the AI chatbot work 24/7**.

```mermaid
flowchart LR
    A[1. Push Code to GitHub] --> B[2. Connect to Cloud Host]
    B --> C[Option A: Render.com (Recommended)]
    B --> D[Option B: Vercel]
    C --> E["Live 24/7 HTTPS Website + Active Qwen AI Proxy"]
    D --> E
```

---

### 📋 Step 1: Push Your Code to GitHub

Open terminal in the `college_web` folder:

```bash
cd college_web

# 1. Initialize Git repository
git init

# 2. Add all files (the included .gitignore automatically protects .env)
git add .

# 3. Commit files
git commit -m "Initial commit: SACET College AI Portal"

# 4. Link to your GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sacet-college-web.git

# 5. Push to GitHub
git push -u origin main
```

---

### ☁️ Step 2: Deploy Free on Render.com (Recommended - 2 Minutes)

1. Go to [Render.com](https://render.com/) and Sign Up / Log In with GitHub (100% Free).
2. Click **New +** → Select **Web Service**.
3. Select your GitHub repository (`sacet-college-web`).
4. Fill in the settings:
   - **Name:** `sacet-college`
   - **Environment:** `Node`
   - **Build Command:** `npm install` (or leave blank)
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
5. **Add Your Secret API Key:**
   - Under the **Environment Variables** tab, click **Add Environment Variable**.
   - **Key:** `OPENROUTER_API_KEY`
   - **Value:** `your_openrouter_api_key_here`
6. Click **Create Web Service**.
7. In about 60 seconds, Render generates your live public URL:
   👉 **`https://sacet-college.onrender.com`**

---

### ⚡ Alternative: Deploy Free on Vercel (1-Click)

1. Go to [Vercel.com](https://vercel.com/) and Sign Up with GitHub.
2. Click **Add New...** → **Project**.
3. Import your repository (`sacet-college-web`).
4. In the **Environment Variables** section:
   - **Key:** `OPENROUTER_API_KEY`
   - **Value:** `your_openrouter_api_key_here`
5. Click **Deploy**.
6. The included `vercel.json` handles routing automatically, giving you an instant live URL:
   👉 **`https://sacet-college-web.vercel.app`**

---

## 📂 Project Structure

```
college_web/
├── index.html              # Main Collegiate Web Portal & AI Chat Interface
├── server.js               # Node.js Server & Secure Qwen API Proxy
├── package.json            # Node.js Package Manifest & Start Scripts
├── vercel.json             # 1-Click Vercel Deployment Configuration
├── .gitignore              # Protects .env from being committed to GitHub
├── .env.example            # Template for environment variables
├── .env                    # Local secrets (NEVER pushed to GitHub)
├── css/
│   └── style.css           # Claude-Inspired Design System
├── js/
│   ├── app.js              # UI Controller, Markdown & Voice Recognition
│   ├── config.js           # Institutional Metadata Configuration
│   ├── knowledge_base.js   # Client-Side RAG Retrieval Engine
│   └── qwen_api.js         # Secure API Client communicating with /api/chat
└── data/
    ├── college_data.json   # Verified Institutional Knowledge (127 Pages Scraped)
    ├── sacet_live_posts.json # Live 2026 Bulletins & Circulars
    └── sacet_all_pages_complete.json # 100% Raw Scraped Pages Database
```
