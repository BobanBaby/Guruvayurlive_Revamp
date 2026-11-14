# 🚩 Guruvayur Live (guruvayurlive.in) — Redesign & Monetization Portal

A modern, high-speed redesign of **[guruvayurlive.in](https://guruvayurlive.in/)** built for **100% free hosting** (Cloudflare Pages / Vercel), **Google AdSense monetization**, and an **integrated Admin Dashboard** to manage photo collections and articles.

---

## 🌟 Key Highlights & Features

1. **Complete Data Migration**:
   - All **4 existing WordPress articles** migrated and formatted cleanly.
   - All **23 authentic media assets** downloaded locally (festival processions, elephant sanctuary, temple gopuram).
   - Compliance legal pages: About Us, Contact Us, Privacy Policy (AdSense DART cookie compliant), Terms & Conditions.

2. **Official Temple Timing & Vedic Schedule**:
   - Real-time **Live Darshan Status tracker** calculated live based on Indian Standard Time (IST - UTC+5:30).
   - Indicates whether sanctum is currently open, which ritual is active, and the next pooja event.
   - Complete 16-step daily pooja schedule from 3:00 AM *Nirmalyam* to 9:15 PM *Harivarasanam*.

3. **Photo Collections & Visual Archives**:
   - Dedicated photo gallery system with categorization (*Festivals & Rituals*, *Temple Architecture*, *Punnathurkotta Elephant Sanctuary*, *Devotional Moments*).
   - High-resolution modal **lightbox viewer** with next/prev arrows and captions.

4. **Google AdSense & Monetization Ready**:
   - Native responsive ad placements:
     - **Top Header Leaderboard** (728x90 desktop / 320x50 mobile)
     - **In-Article & In-Feed Banners**
     - **Sidebar Medium Rectangle** (300x250 / 300x600)
     - **Mobile Sticky Footer Anchor Ad** (320x50 with close toggle)
   - Auto-generated `ads.txt` served at `/ads.txt`.
   - AdSense **Test Mode Toggle** in Admin: preview ad layouts before connecting live publisher ID.

5. **Built-in Admin Dashboard (`/admin`)**:
   - **Login Credentials (Default):**
     - Username: `admin`
     - Password: `guruvayur2026`
   - **Features:**
     - Create new **Photo Collections** with multi-image upload & captions.
     - Publish new **Devotee Guides & Articles**.
     - Edit or delete existing posts & galleries.
     - Media asset manager & direct image uploader.
     - Toggle AdSense slots, switch Test vs Live mode, configure Publisher ID.
     - **1-Click Static Site Exporter** for Cloudflare Pages / Vercel.

---

## 🚀 Running the Local Demo

### Option 1: 1-Click Launch (Windows)
Double-click:
`c:\rd\run-guruvayurlive-demo.bat`
*(This starts the local web server and automatically opens both the public site and admin portal in your browser)*

### Option 2: Command Line
```powershell
cd c:\rd\guruvayurlive
node server.js
```
Then open:
- **Public Website:** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3000/admin`
- **AdSense Verification:** `http://localhost:3000/ads.txt`

---

## ☁️ How to Host 100% Freely with Custom Domain

When you are ready to upload, you can host the generated `c:\rd\guruvayurlive\dist` folder completely free with SSL and unlimited bandwidth:

### Recommended: Cloudflare Pages (Unlimited Free Bandwidth)
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) & log in.
2. Navigate to **Workers & Pages &rarr; Create application &rarr; Pages &rarr; Upload assets**.
3. Drag and drop the `c:\rd\guruvayurlive\dist` folder.
4. Once deployed, click **Custom domains &rarr; Set up a custom domain** and enter `guruvayurlive.in`.
5. Point your domain's nameservers or CNAME to Cloudflare.

### Alternative: Vercel
1. Push this directory or the `dist` folder to GitHub.
2. Import project on [vercel.com](https://vercel.com).
3. Assign custom domain `guruvayurlive.in` in Settings.
