/**
 * Guruvayur Live - Template Engine
 * Generates SEO-optimized HTML for all pages with AdSense slots and metadata
 */

const fs = require('fs');
const path = require('path');

function getAdSlotHtml(type, config) {
  if (!config.adsense.enabled) return '';

  const isTest = config.adsense.testMode;
  const pubId = config.adsense.publisherId;

  if (type === 'header') {
    if (!config.adsense.slots.headerBanner) return '';
    return `
      <div class="ad-slot-wrapper container">
        <span class="ad-label">Advertisement</span>
        ${isTest ? `
          <div class="ad-placeholder ad-leaderboard">
            <span>Responsive Header Leaderboard Ad (728x90 / 320x50)</span>
            <small>AdSense Slot: Top Header Banner (${pubId})</small>
          </div>
        ` : `
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="${pubId}"
               data-ad-slot="1234567890"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        `}
      </div>
    `;
  }

  if (type === 'in-article') {
    if (!config.adsense.slots.inArticleBanner) return '';
    return `
      <div class="ad-slot-wrapper" style="margin: 28px 0;">
        <span class="ad-label">Advertisement</span>
        ${isTest ? `
          <div class="ad-placeholder ad-in-article">
            <span>In-Article Content Ad (Responsive / Native In-Feed)</span>
            <small>AdSense Slot: In-Article Stream</small>
          </div>
        ` : `
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="${pubId}"
               data-ad-slot="2345678901"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        `}
      </div>
    `;
  }

  if (type === 'sidebar') {
    if (!config.adsense.slots.sidebarBanner) return '';
    return `
      <div class="ad-slot-wrapper" style="margin: 0;">
        <span class="ad-label">Advertisement</span>
        ${isTest ? `
          <div class="ad-placeholder ad-medium-rectangle">
            <span>Sidebar Display Ad (300x250 / 300x600)</span>
            <small>AdSense Slot: Sidebar Banner</small>
          </div>
        ` : `
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="${pubId}"
               data-ad-slot="3456789012"
               data-ad-format="rectangle"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        `}
      </div>
    `;
  }

  if (type === 'sticky-footer') {
    if (!config.adsense.slots.stickyFooter) return '';
    return `
      <div class="sticky-footer-ad">
        <button class="sticky-ad-close" aria-label="Close Advertisement">&times;</button>
        <div style="text-align:center;">
          <span class="ad-label" style="margin-bottom:2px; font-size:0.65rem;">Advertisement</span>
          ${isTest ? `
            <div style="background:#f1f5f9; padding:4px 16px; font-size:0.75rem; color:#475569; border-radius:4px; border:1px dashed #cbd5e1;">
              <strong>Mobile Sticky Anchor Ad (320x50)</strong> - Google AdSense Ready
            </div>
          ` : `
            <ins class="adsbygoogle"
                 style="display:inline-block;width:320px;height:50px"
                 data-ad-client="${pubId}"
                 data-ad-slot="4567890123"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          `}
        </div>
      </div>
    `;
  }

  return '';
}

function layout(title, content, activeNav = '', siteData, customMeta = '') {
  const cfg = siteData.config;
  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${cfg.siteTitle}</title>
  <meta name="description" content="${customMeta || cfg.tagline}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${cfg.siteUrl}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="alternate icon" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">

  <!-- OpenGraph / Social Meta Tags (Google & AI Snippets) -->
  <meta property="og:locale" content="en_IN">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title} | ${cfg.siteTitle}">
  <meta property="og:description" content="${customMeta || cfg.tagline}">
  <meta property="og:url" content="${cfg.siteUrl}">
  <meta property="og:site_name" content="${cfg.siteTitle}">
  <meta property="og:image" content="${cfg.siteUrl}/images/uploads/Guruvayur-Temple-scaled.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} | ${cfg.siteTitle}">
  <meta name="twitter:description" content="${customMeta || cfg.tagline}">
  <meta name="theme-color" content="#991b1b">

  <!-- Schema.org JSON-LD for Google, Gemini, and AI Search Engines -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "${cfg.siteUrl}/#website",
        "url": "${cfg.siteUrl}",
        "name": "Guruvayur Live",
        "description": "Comprehensive Devotee Guide for Guruvayur Sree Krishna Temple with Live Darshan Timings, Dress Code, and Festival Schedules",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "${cfg.siteUrl}/posts?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "HinduTemple",
        "@id": "${cfg.siteUrl}/#temple",
        "name": "Guruvayur Sree Krishna Temple",
        "alternateName": ["Guruvayurappan Temple", "Bhuloka Vaikuntham", "Guruvayoor Temple"],
        "description": "Ancient sacred shrine dedicated to Lord Guruvayurappan in Thrissur, Kerala. Famous for Nirmalya Darshan, Ulsavam and Ekadasi.",
        "url": "https://guruvayurdevaswom.in",
        "telephone": "+91-487-2556335",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "East Nada",
          "addressLocality": "Guruvayur",
          "addressRegion": "Kerala",
          "postalCode": "680101",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 10.5947,
          "longitude": 76.0388
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "03:00",
            "closes": "13:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "16:30",
            "closes": "21:30"
          }
        ]
      }
    ]
  }
  </script>

  <link rel="stylesheet" href="/css/style.css">
  ${!cfg.adsense.testMode && cfg.adsense.enabled ? `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cfg.adsense.publisherId}" crossorigin="anonymous"></script>
  ` : ''}
</head>
<body>
  ${cfg.announcement.enabled ? `
    <div class="top-announcement">
      <span>${cfg.announcement.text}</span>
      <a href="${cfg.announcement.link}">View Schedule &rarr;</a>
    </div>
  ` : ''}

  <!-- Header & Navigation -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand" aria-label="Guruvayur Live - Home">
        <div class="brand-icon" aria-hidden="true">🪔</div>
        <div class="brand-text">
          <span class="brand-name">Guruvayur<span class="brand-accent">Live</span></span>
          <span class="brand-tagline">Devotee Guide &bull; Live Darshan</span>
        </div>
      </a>

      <!-- Quick Finder Search Bar -->
      <div class="header-search-wrap">
        <div class="header-search-bar">
          <span class="search-icon" aria-hidden="true">🔍</span>
          <input type="text" id="header-search-input" placeholder="Find timings, rules, hotels..." aria-label="Search Guruvayur Live guides and timings" autocomplete="off">
        </div>
        <div id="header-search-results" class="search-dropdown" style="display:none;"></div>
      </div>

      <button class="mobile-toggle" aria-label="Toggle Navigation">&#9776;</button>

      <!-- Clean Public Navigation (Admin link placed discreetly in footer) -->
      <nav class="main-nav" role="navigation" aria-label="Main Navigation">
        <a href="/" class="nav-link ${activeNav === 'home' ? 'active' : ''}">Home</a>
        <a href="/timings" class="nav-link ${activeNav === 'timings' ? 'active' : ''}">Pooja Timings</a>
        <a href="/entry-rules" class="nav-link ${activeNav === 'rules' ? 'active' : ''}">Dress Code &amp; Rules</a>
        <a href="/galleries" class="nav-link ${activeNav === 'galleries' ? 'active' : ''}">Photo Galleries</a>
        <a href="/posts" class="nav-link ${activeNav === 'posts' ? 'active' : ''}">Devotee Guides</a>
        <a href="/travel-guide" class="nav-link ${activeNav === 'travel' ? 'active' : ''}">Hotels &amp; Travel</a>
      </nav>
    </div>
  </header>

  <div class="live-status-bar">
    <div class="container live-status-flex" id="live-temple-status">
      <div class="status-indicator">
        <span class="pulse-dot"></span>
        <span>TEMPLE STATUS: <strong>CHECKING...</strong></span>
      </div>
      <div class="devaswom-badge">
        <span>Verified Temple Timings (IST)</span>
      </div>
    </div>
  </div>

  ${getAdSlotHtml('header', cfg)}

  <main>
    ${content}
  </main>

  ${getAdSlotHtml('sticky-footer', cfg)}

  <!-- Lightbox Modal for Photo Collections -->
  <div id="lightbox-modal" class="lightbox-modal" role="dialog" aria-modal="true">
    <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
    <button class="lightbox-prev" aria-label="Previous Photo">&#10094;</button>
    <button class="lightbox-next" aria-label="Next Photo">&#10095;</button>
    <div class="lightbox-img-wrap">
      <img id="lightbox-img" src="" alt="Enlarged photo">
    </div>
    <div id="lightbox-caption" class="lightbox-caption"></div>
  </div>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>About Guruvayur Live</h4>
          <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">
            An independent informational portal & visual chronicle created to help devotees worldwide plan their pilgrimage to <em>Bhuloka Vaikuntham</em> (Guruvayur Sree Krishna Temple).
          </p>
          <div class="footer-disclaimer-box">
            <strong>Devaswom Disclaimer:</strong> This portal is independent and not operated by the Guruvayur Devaswom Board. For official e-darshan, offerings & room booking, visit <a href="${cfg.officialDevaswomUrl}" target="_blank" rel="noopener">guruvayurdevaswom.in</a>.
          </div>
        </div>

        <div class="footer-col">
          <h4>Essential Guides</h4>
          <ul class="footer-links">
            <li><a href="/timings">Nirmalyam & Pooja Timings</a></li>
            <li><a href="/entry-rules">Dress Code & Entry Regulations</a></li>
            <li><a href="/marriage-guide">Marriage / Kalyanam Booking</a></li>
            <li><a href="/travel-guide">Reaching Guruvayur by Train/Air</a></li>
            <li><a href="/festivals">Ulsavam & Ekadasi Calendar</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Media & Visuals</h4>
          <ul class="footer-links">
            <li><a href="/galleries">All Photo Collections</a></li>
            <li><a href="/gallery/guruvayur-temple-architecture">Temple Architecture Gallery</a></li>
            <li><a href="/gallery/ulsavam-festival-processions">Elephant Processions (Seeveli)</a></li>
            <li><a href="/gallery/punnathurkotta-elephant-sanctuary">Punnathurkotta Camp</a></li>
            <li><a href="/posts">Devotee Blog & Articles</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Information & Legal</h4>
          <ul class="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Editorial Team</a></li>
            <li><a href="/privacy-policy">Privacy Policy (AdSense Compliant)</a></li>
            <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>&copy; ${new Date().getFullYear()} Guruvayur Live (guruvayurlive.in). All rights reserved.</div>
        <div>Designed for High-Speed Performance &amp; 100% Free Cloudflare / Vercel Hosting</div>
      </div>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>`;
}

// 1. Home Page HTML
function renderHome(siteData) {
  const cfg = siteData.config;
  const posts = siteData.posts;
  const galleries = siteData.galleries;
  const timetable = siteData.timetable.slice(0, 6);

  const content = `
    <!-- Hero Banner -->
    <section class="hero-section">
      <div class="container hero-content">
        <span class="hero-subtitle">Bhuloka Vaikuntham &bull; Kerala, India</span>
        <h2 class="hero-title">Experience the Divine Grace of Lord Guruvayurappan</h2>
        <p class="hero-desc">
          Your complete pilgrim handbook: real-time darshan status, authentic pooja schedules, sacred photo collections, and practical travel guidance.
        </p>
        <div class="hero-actions">
          <a href="/timings" class="btn btn-primary">View Daily Pooja Timings</a>
          <a href="/galleries" class="btn btn-outline">Explore Photo Galleries</a>
        </div>
      </div>
    </section>

    <!-- Quick Access Hub -->
    <section class="quick-hub-section container">
      <div class="quick-hub-grid">
        <a href="/timings" class="hub-card">
          <div class="hub-icon">⏰</div>
          <div class="hub-title">Pooja & Darshan Timings</div>
          <div class="hub-desc">From 3:00 AM Nirmalyam to 9:15 PM Harivarasanam.</div>
        </a>

        <a href="/entry-rules" class="hub-card">
          <div class="hub-icon">📜</div>
          <div class="hub-title">Dress Code & Entry Rules</div>
          <div class="hub-desc">Mundu/Dhoti rules, women's dress guidelines, cloakrooms.</div>
        </a>

        <a href="/galleries" class="hub-card">
          <div class="hub-icon">📸</div>
          <div class="hub-title">Photo Collections</div>
          <div class="hub-desc">Authentic photo archives of processions, elephants & sanctum.</div>
        </a>

        <a href="/marriage-guide" class="hub-card">
          <div class="hub-icon">💍</div>
          <div class="hub-title">Wedding / Kalyanam Guide</div>
          <div class="hub-desc">Mandapam token procedure, photography and thali rituals.</div>
        </a>

        <a href="/travel-guide" class="hub-card">
          <div class="hub-icon">🏨</div>
          <div class="hub-title">Hotels & Travel Guide</div>
          <div class="hub-desc">Stay near East & West Nada, railway station & taxi tips.</div>
        </a>
      </div>
    </section>

    <!-- In-Feed Mid Ad -->
    ${getAdSlotHtml('in-article', cfg)}

    <!-- Photo Collections Section -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Visual Archives</span>
          <h2 class="section-title">Sacred Photo Collections &amp; Galleries</h2>
          <p class="section-subtitle">
            Curated photographic galleries capturing the majesty of festival processions, the East Nada Gopuram, and temple elephants.
          </p>
        </div>

        <div class="gallery-grid">
          ${galleries.map(g => `
            <div class="gallery-card">
              <div class="gallery-thumb-wrap">
                <img src="${g.coverImage}" alt="${g.title}" loading="lazy">
                <span class="gallery-badge">${g.images ? g.images.length : 0} Photos</span>
              </div>
              <div class="gallery-info">
                <span class="gallery-cat">${g.category}</span>
                <h3 class="gallery-title">${g.title}</h3>
                <p class="gallery-desc">${g.description}</p>
                <a href="/gallery/${g.id}" class="gallery-view-btn">
                  <span>View Full Album</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Daily Timings Preview & Practical Tips -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Daily Ritual Schedule</span>
          <h2 class="section-title">Official Pooja &amp; Darshan Timetable</h2>
          <p class="section-subtitle">
            The temple follows a strict traditional Vedic schedule. Check key timings below or see the complete schedule.
          </p>
        </div>

        <div class="timetable-card">
          <table class="timetable-table">
            <thead>
              <tr>
                <th>Time (IST)</th>
                <th>Ritual / Pooja</th>
                <th>Significance &amp; Notes</th>
              </tr>
            </thead>
            <tbody>
              ${timetable.map(t => `
                <tr>
                  <td class="timetable-time">${t.time}</td>
                  <td class="timetable-event">${t.event}</td>
                  <td class="timetable-desc">${t.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="/timings" class="btn btn-primary">See Full 16-Step Daily Schedule &rarr;</a>
        </div>
      </div>
    </section>

    <!-- Latest Guides & Articles -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Pilgrim Handbook</span>
          <h2 class="section-title">Latest Articles &amp; Devotee Guides</h2>
          <p class="section-subtitle">
            In-depth guides covering festival schedules, temple history, dress code tips, and pilgrim logistics.
          </p>
        </div>

        <div class="post-grid">
          ${posts.map(p => `
            <article class="post-card">
              <div class="post-thumb">
                <img src="${p.featuredImage}" alt="${p.title}" loading="lazy">
              </div>
              <div class="post-body">
                <div class="post-meta">
                  <span class="post-cat">${p.category}</span>
                  <span>&bull;</span>
                  <span>${p.date}</span>
                </div>
                <h3 class="post-title">
                  <a href="/post/${p.slug}">${p.title}</a>
                </h3>
                <p class="post-excerpt">${p.excerpt}</p>
                <a href="/post/${p.slug}" class="post-read-more">
                  Read Complete Guide &rarr;
                </a>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  return layout('Comprehensive Devotee Guide & Live Timings', content, 'home', siteData);
}

// 2. Timings Page HTML
function renderTimings(siteData) {
  const timetable = siteData.timetable;
  const cfg = siteData.config;

  const content = `
    <div class="container" style="padding-top: 40px;">
      <div class="section-header">
        <span class="section-tag">Vedic Routine</span>
        <h1 class="section-title">Guruvayur Temple Daily Pooja Timings &amp; Darshan Schedule</h1>
        <p class="section-subtitle">
          The sanctum sanctorum opens at 3:00 AM for the auspicious Nirmalyam and follows continuous traditional rituals until closing at 9:15 PM.
        </p>
      </div>

      ${getAdSlotHtml('in-article', cfg)}

      <div class="timetable-card">
        <table class="timetable-table">
          <thead>
            <tr>
              <th style="width: 25%;">Time (IST)</th>
              <th style="width: 30%;">Ritual / Pooja Ceremony</th>
              <th>Description &amp; Devotee Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${timetable.map(t => `
              <tr>
                <td class="timetable-time">${t.time}</td>
                <td class="timetable-event">${t.event}</td>
                <td class="timetable-desc">${t.desc}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="background:#fff; border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:28px; margin-top:36px;">
        <h3 style="color:var(--primary); margin-bottom:12px;">Important Darshan Tips for Devotees:</h3>
        <ul style="margin-left: 20px; line-height: 1.8; color: var(--text-muted);">
          <li><strong>Nirmalyam Darshan Queue:</strong> Devotees hoping to view Nirmalyam at 3:00 AM usually begin lining up outside East Nada by 1:30 AM to 2:00 AM.</li>
          <li><strong>Afternoon Break:</strong> The temple is closed between 1:30 PM and 4:30 PM. No darshan is conducted during this period.</li>
          <li><strong>Senior Citizens Line:</strong> Designated priority timings for senior citizens are typically arranged during specific morning and evening windows (verify at the Devaswom queue counter).</li>
          <li><strong>Deeparadhana (Lamp Illumination):</strong> Conducted at dusk around 6:00 PM – 6:30 PM, accompanied by the ringing of bells and the lighting of thousands of oil lamps.</li>
        </ul>
      </div>
    </div>
  `;

  return layout('Daily Pooja Timings & Schedule', content, 'timings', siteData);
}

// 3. Galleries Archive HTML
function renderGalleries(siteData) {
  const galleries = siteData.galleries;
  const cfg = siteData.config;

  const content = `
    <div class="container" style="padding-top: 40px;">
      <div class="section-header">
        <span class="section-tag">Visual Chronicle</span>
        <h1 class="section-title">Guruvayur Temple Photo Collections &amp; Visual Archives</h1>
        <p class="section-subtitle">
          Explore high-resolution curated image collections depicting temple architecture, caparisoned elephant processions, Seeveli rituals, and Punnathurkotta.
        </p>
      </div>

      ${getAdSlotHtml('in-article', cfg)}

      <div class="gallery-grid" style="margin-top: 32px;">
        ${galleries.map(g => `
          <div class="gallery-card">
            <div class="gallery-thumb-wrap">
              <img src="${g.coverImage}" alt="${g.title}">
              <span class="gallery-badge">${g.images ? g.images.length : 0} Photos</span>
            </div>
            <div class="gallery-info">
              <span class="gallery-cat">${g.category}</span>
              <h2 class="gallery-title" style="font-size:1.2rem;">${g.title}</h2>
              <p class="gallery-desc">${g.description}</p>
              <a href="/gallery/${g.id}" class="gallery-view-btn">
                <span>Open Photo Collection</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return layout('Photo Collections & Visual Archives', content, 'galleries', siteData);
}

// 4. Single Gallery View HTML
function renderSingleGallery(gallery, siteData) {
  const cfg = siteData.config;
  const imagesJson = JSON.stringify(gallery.images || []);

  const content = `
    <div class="container" style="padding-top: 40px;">
      <nav style="font-size:0.85rem; color:var(--text-light); margin-bottom:16px;">
        <a href="/">Home</a> &gt; <a href="/galleries">Photo Collections</a> &gt; <span style="color:var(--primary); font-weight:600;">${gallery.title}</span>
      </nav>

      <div class="article-header" style="text-align:center; max-width:800px; margin:0 auto 36px;">
        <span class="section-tag">${gallery.category}</span>
        <h1 style="font-size:2.2rem; color:var(--primary); margin:12px 0;">${gallery.title}</h1>
        <p style="color:var(--text-muted); font-size:1.05rem;">${gallery.description}</p>
      </div>

      ${getAdSlotHtml('in-article', cfg)}

      <div class="gallery-grid" style="margin: 32px 0;">
        ${(gallery.images || []).map((img, idx) => `
          <div class="gallery-card" style="cursor:pointer;" onclick='openLightbox(${imagesJson.replace(/'/g, "&#39;")}, ${idx})'>
            <div class="gallery-thumb-wrap" style="aspect-ratio: 4/3;">
              <img src="${img.url}" alt="${img.caption || gallery.title}" loading="lazy">
            </div>
            <div style="padding: 12px; font-size:0.88rem; color:var(--text-main); font-weight:600;">
              ${img.caption || `Photo ${idx + 1}`}
              <div style="font-size:0.75rem; color:var(--gold-dark); margin-top:4px;">Click to enlarge &rarr;</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align:center; margin: 40px 0;">
        <a href="/galleries" class="btn btn-outline" style="color:var(--primary); border-color:#cbd5e1;">&larr; Back to All Collections</a>
      </div>
    </div>
  `;

  return layout(gallery.title, content, 'galleries', siteData);
}

// 5. Posts Archive HTML
function renderPosts(siteData) {
  const posts = siteData.posts;
  const cfg = siteData.config;

  const content = `
    <div class="container" style="padding-top: 40px;">
      <div class="section-header">
        <span class="section-tag">Devotee Handbook</span>
        <h1 class="section-title">Guruvayur Temple Articles &amp; Travel Guides</h1>
        <p class="section-subtitle">
          Essential articles on festival schedules, temple rules, historical origins, and pilgrim accommodations.
        </p>
      </div>

      ${getAdSlotHtml('in-article', cfg)}

      <div class="post-grid" style="margin-top: 36px;">
        ${posts.map(p => `
          <article class="post-card">
            <div class="post-thumb">
              <img src="${p.featuredImage}" alt="${p.title}" loading="lazy">
            </div>
            <div class="post-body">
              <div class="post-meta">
                <span class="post-cat">${p.category}</span>
                <span>&bull;</span>
                <span>${p.date}</span>
              </div>
              <h2 class="post-title" style="font-size:1.25rem;">
                <a href="/post/${p.slug}">${p.title}</a>
              </h2>
              <p class="post-excerpt">${p.excerpt}</p>
              <a href="/post/${p.slug}" class="post-read-more">
                Read Complete Guide &rarr;
              </a>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;

  return layout('Devotee Guides & Temple Articles', content, 'posts', siteData);
}

// 6. Single Post HTML
function renderSinglePost(post, siteData) {
  const cfg = siteData.config;
  const relatedPosts = siteData.posts.filter(p => p.id !== post.id).slice(0, 3);

  const content = `
    <div class="container article-layout">
      <div class="article-main">
        <nav style="font-size:0.85rem; color:var(--text-light); margin-bottom:16px;">
          <a href="/">Home</a> &gt; <a href="/posts">Guides</a> &gt; <span style="color:var(--primary); font-weight:600;">${post.category}</span>
        </nav>

        <header class="article-header">
          <span class="section-tag">${post.category}</span>
          <h1 style="margin: 12px 0;">${post.title}</h1>
          <div style="font-size:0.88rem; color:var(--text-light); display:flex; gap:16px; align-items:center;">
            <span>By <strong>Guruvayur Live Editorial</strong></span>
            <span>&bull;</span>
            <span>Published on ${post.date}</span>
          </div>
        </header>

        <div class="article-featured-img">
          <img src="${post.featuredImage}" alt="${post.title}">
        </div>

        ${getAdSlotHtml('in-article', cfg)}

        <div class="article-content">
          ${post.content}
        </div>

        ${post.gallery && post.gallery.length > 0 ? `
          <div style="margin: 36px 0; padding-top: 24px; border-top: 2px solid var(--border-subtle);">
            <span class="section-tag">Article Photo Gallery</span>
            <h3 style="color:var(--primary); margin: 10px 0 16px;">Attached Photo Collection (${post.gallery.length} Images)</h3>
            <div class="gallery-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
              ${post.gallery.map((gImg, idx) => `
                <div class="gallery-card" style="cursor:pointer;" onclick='openLightbox(${JSON.stringify(post.gallery).replace(/'/g, "&#39;")}, ${idx})'>
                  <div class="gallery-thumb-wrap" style="aspect-ratio: 4/3;">
                    <img src="${gImg.url}" alt="${gImg.caption || 'Photo ' + (idx + 1)}" loading="lazy">
                  </div>
                  <div style="padding: 10px; font-size: 0.85rem; color: var(--text-main); font-weight: 600;">
                    ${gImg.caption || 'Photo ' + (idx + 1)}
                    <div style="font-size: 0.72rem; color: var(--gold-dark); margin-top: 2px;">Click to enlarge &rarr;</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${getAdSlotHtml('in-article', cfg)}

        <div style="margin-top: 40px; padding: 20px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:0.88rem; border-left:4px solid var(--primary);">
          <strong>Devaswom Notice:</strong> For official pooja receipts, vazhipadu bookings, and room reservations, always visit the official Guruvayur Devaswom portal at <a href="${cfg.officialDevaswomUrl}" target="_blank" rel="noopener">guruvayurdevaswom.in</a>.
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="article-sidebar">
        ${getAdSlotHtml('sidebar', cfg)}

        <div class="sidebar-widget">
          <h3 class="sidebar-title">Quick Timings Summary</h3>
          <ul style="list-style:none; font-size:0.88rem; line-height:2;">
            <li><strong>Morning:</strong> 3:00 AM – 1:30 PM</li>
            <li><strong>Afternoon Break:</strong> 1:30 PM – 4:30 PM</li>
            <li><strong>Evening:</strong> 4:30 PM – 9:15 PM</li>
            <li><strong>Deeparadhana:</strong> ~6:00 PM – 6:45 PM</li>
          </ul>
          <a href="/timings" style="display:inline-block; margin-top:10px; font-weight:700; font-size:0.85rem;">See Full Timetable &rarr;</a>
        </div>

        <div class="sidebar-widget">
          <h3 class="sidebar-title">Other Recommended Guides</h3>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${relatedPosts.map(rp => `
              <div>
                <a href="/post/${rp.slug}" style="font-weight:700; font-size:0.92rem; color:var(--text-main); display:block; line-height:1.4;">${rp.title}</a>
                <small style="color:var(--text-light);">${rp.category} &bull; ${rp.date}</small>
              </div>
            `).join('')}
          </div>
        </div>
      </aside>
    </div>
  `;

  return layout(post.title, content, 'posts', siteData, post.excerpt);
}

// 7. Entry Rules & Dress Code Page
function renderRulesPage(siteData) {
  const cfg = siteData.config;
  const content = `
    <div class="container" style="padding-top: 40px; max-width: 900px;">
      <div class="section-header">
        <span class="section-tag">Pilgrim Regulations</span>
        <h1 class="section-title">Guruvayur Temple Entry Rules &amp; Dress Code Guidelines</h1>
        <p class="section-subtitle">
          Ensure a smooth and hassle-free darshan by observing the traditional dress code, security guidelines, and queue rules.
        </p>
      </div>

      ${getAdSlotHtml('in-article', cfg)}

      <div class="article-main" style="margin-top:24px;">
        <h2 style="color:var(--primary); margin-bottom:16px;">Traditional Dress Code (Strictly Enforced)</h2>
        
        <div style="background:#fefce8; padding:20px; border-radius:var(--radius-md); border:1px solid #fef08a; margin-bottom:24px;">
          <h3 style="color:var(--gold-dark); margin-bottom:8px;">Men's Dress Code:</h3>
          <ul style="margin-left:20px; line-height:1.8;">
            <li>Must wear a traditional <strong>Dhoti (Mundu)</strong> around the waist.</li>
            <li>Shirts, banyans, vests, and t-shirts are <strong>strictly prohibited</strong> inside the inner courtyard.</li>
            <li>An <em>Angavastram</em> (small shoulder cloth/towel) may be draped over the shoulder or chest.</li>
            <li>Pants, jeans, Bermudas, shorts, or modern stitched lower garments are not permitted inside the sanctum.</li>
          </ul>
        </div>

        <div style="background:#fefce8; padding:20px; border-radius:var(--radius-md); border:1px solid #fef08a; margin-bottom:24px;">
          <h3 style="color:var(--gold-dark); margin-bottom:8px;">Women's Dress Code:</h3>
          <ul style="margin-left:20px; line-height:1.8;">
            <li>Saree, Half-Saree (Pavada & Blouse), Set Mundu, or Chudidhar/Salwar Kameez with Dupatta.</li>
            <li>Western wear, jeans, skirts, trousers, or tops without dupatta are <strong>strictly prohibited</strong>.</li>
          </ul>
        </div>

        <div style="background:#fefce8; padding:20px; border-radius:var(--radius-md); border:1px solid #fef08a; margin-bottom:24px;">
          <h3 style="color:var(--gold-dark); margin-bottom:8px;">Children's Attire:</h3>
          <ul style="margin-left:20px; line-height:1.8;">
            <li>Young boys must wear a Mundu/Dhoti (or remain bare-chested with traditional wrap).</li>
            <li>Young girls may wear traditional skirts (Pattu Pavada) or dresses.</li>
          </ul>
        </div>

        <h2 style="color:var(--primary); margin:32px 0 16px;">Electronics &amp; Prohibited Items</h2>
        <ul style="margin-left:20px; line-height:1.8; color:var(--text-main);">
          <li><strong>Mobile Phones &amp; Cameras:</strong> Strictly prohibited inside the inner complex. Free and paid safe deposit counters (Cloak Rooms) operated by Devaswom are situated near East Nada.</li>
          <li><strong>Leather Articles:</strong> Belts with metal/leather, shoes, footwear, and leather pouches must be deposited at footwear counters outside.</li>
          <li><strong>Tobacco &amp; Alcohol:</strong> Strictly forbidden. Smoking and chewing tobacco in the temple vicinity is punishable by law.</li>
        </ul>
      </div>
    </div>
  `;

  return layout('Dress Code & Entry Regulations', content, 'rules', siteData);
}

// 8. Travel & Hotels Guide Page
function renderTravelGuide(siteData) {
  const cfg = siteData.config;
  const content = `
    <div class="container" style="padding-top: 40px; max-width: 900px;">
      <div class="section-header">
        <span class="section-tag">Travel Logistics</span>
        <h1 class="section-title">How to Reach Guruvayur &amp; Recommended Stays</h1>
        <p class="section-subtitle">
          Complete guide on rail connections, airports, taxi desks, and choosing the best hotel near East or West Nada.
        </p>
      </div>

      ${getAdSlotHtml('in-article', cfg)}

      <div class="article-main" style="margin-top:24px;">
        <h2 style="color:var(--primary); margin-bottom:16px;">Reaching Guruvayur</h2>

        <div style="margin-bottom:28px;">
          <h3>1. By Train (Railways)</h3>
          <p style="margin:8px 0 16px;">
            <strong>Guruvayur Railway Station (Station Code: GUU):</strong> Located just 1.2 km from the temple (3–5 minutes by auto-rickshaw). Several passenger and express trains terminate here directly from Chennai, Trivandrum, and Ernakulam.
          </p>
          <p>
            <strong>Thrissur Railway Station (Station Code: TCR):</strong> Located 28 km away, Thrissur is a major rail junction served by almost all major superfast and Rajdhani express trains. KSRTC buses run every 5 minutes from Thrissur to Guruvayur.
          </p>
        </div>

        <div style="margin-bottom:28px;">
          <h3>2. By Air (Flights)</h3>
          <p style="margin:8px 0 16px;">
            <strong>Cochin International Airport (COK - Nedumbassery):</strong> Located 80 km away (~2 hours by taxi or direct KSRTC low-floor AC bus). Most convenient for domestic and international pilgrims.
          </p>
          <p>
            <strong>Calicut International Airport (CCJ - Karipur):</strong> Located 85 km away (~2.5 hours by road via Ponnani/Chavakad).
          </p>
        </div>

        <h2 style="color:var(--primary); margin:32px 0 16px;">Where to Stay in Guruvayur</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px;">
          <div style="background:#f8fafc; padding:20px; border-radius:var(--radius-md); border:1px solid #e2e8f0;">
            <h4 style="color:var(--primary); margin-bottom:8px;">East Nada (Kizhakkekotta)</h4>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">
              Closest to the main temple gopuram, VIP lines, and Devaswom main booking counters. Ideal for families with elderly devotees who want walking access.
            </p>
          </div>

          <div style="background:#f8fafc; padding:20px; border-radius:var(--radius-md); border:1px solid #e2e8f0;">
            <h4 style="color:var(--primary); margin-bottom:8px;">West Nada (Padinjarekotta)</h4>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">
              Closer to Guruvayur railway station and KSRTC bus stand. Features larger hotels, spacious parking grounds, and peaceful ambiance away from main crowds.
            </p>
          </div>
        </div>

        <div style="background:#fefce8; padding:20px; border-radius:var(--radius-md); border:1px solid #fef08a;">
          <h4 style="color:var(--gold-dark); margin-bottom:6px;">Official Devaswom Guest Houses:</h4>
          <p style="font-size:0.88rem; line-height:1.6;">
            The Guruvayur Devaswom manages <em>Panchajanyam</em>, <em>Kousthubham</em>, and <em>Sreevalsam</em> guest houses. Advance online booking must be done strictly through <a href="${cfg.officialDevaswomUrl}" target="_blank" rel="noopener">guruvayurdevaswom.in</a>.
          </p>
        </div>
      </div>
    </div>
  `;

  return layout('Hotels & Travel Guide', content, 'travel', siteData);
}

// 9. Static Legal Pages (About, Privacy Policy, Terms)
function renderStaticPage(pageKey, siteData) {
  const page = siteData.pages[pageKey];
  const cfg = siteData.config;

  const content = `
    <div class="container" style="padding-top: 40px; max-width: 850px;">
      <div class="article-main">
        <header class="article-header">
          <h1>${page.title}</h1>
          <small style="color:var(--text-light);">Last Updated: ${page.lastUpdated}</small>
        </header>

        ${getAdSlotHtml('in-article', cfg)}

        <div class="article-content">
          ${page.content}
        </div>
      </div>
    </div>
  `;

  return layout(page.title, content, '', siteData);
}

module.exports = {
  renderHome,
  renderTimings,
  renderGalleries,
  renderSingleGallery,
  renderPosts,
  renderSinglePost,
  renderRulesPage,
  renderTravelGuide,
  renderStaticPage,
  layout
};
