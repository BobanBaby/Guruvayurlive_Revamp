const express = require('express');
const fs = require('fs');
const path = require('path');
const templates = require('./render-templates');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Paths
const dataFilePath = path.join(__dirname, 'data', 'site-content.json');
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'images', 'uploads');
const distDir = path.join(__dirname, 'dist');

fs.mkdirSync(uploadsDir, { recursive: true });

function loadData() {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// High-speed static caching & Security Headers for Search & AI Crawlers
app.use((req, res, next) => {
  if (req.url.startsWith('/css/') || req.url.startsWith('/js/') || req.url.startsWith('/images/') || req.url.endsWith('.svg') || req.url.endsWith('.ico')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Serve static assets
app.use(express.static(publicDir));

// Route: Favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(publicDir, 'favicon.svg'));
});

app.get('/favicon.svg', (req, res) => {
  res.sendFile(path.join(publicDir, 'favicon.svg'));
});

// Route: robots.txt (Direct crawler instructions)
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(publicDir, 'robots.txt'));
});

// Route: llms.txt (AI bot & LLM search optimization)
app.get('/llms.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(publicDir, 'llms.txt'));
});

// Route: sitemap.xml (Comprehensive XML Sitemap for Google & Bing)
app.get('/sitemap.xml', (req, res) => {
  const data = loadData();
  res.type('application/xml');
  res.send(generateSitemapXml(data));
});

// Route: ads.txt
app.get('/ads.txt', (req, res) => {
  const data = loadData();
  const pubId = (data.config.adsense && data.config.adsense.publisherId) || 'pub-0000000000000000';
  const cleanPub = pubId.replace('ca-', '');
  res.type('text/plain');
  res.send(`google.com, ${cleanPub}, DIRECT, f08c47fec0942fa0\n`);
});

// Route: Admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin.html'));
});

// Route: Home
app.get('/', (req, res) => {
  const data = loadData();
  res.send(templates.renderHome(data));
});

// Route: Timings
app.get('/timings', (req, res) => {
  const data = loadData();
  res.send(templates.renderTimings(data));
});

// Route: Galleries
app.get('/galleries', (req, res) => {
  const data = loadData();
  res.send(templates.renderGalleries(data));
});

app.get('/gallery/:id', (req, res) => {
  const data = loadData();
  const gallery = data.galleries.find(g => g.id === req.params.id);
  if (!gallery) return res.status(404).send(templates.layout('Gallery Not Found', '<div class="container" style="padding:60px 0; text-align:center;"><h2>Photo collection not found</h2><a href="/galleries" class="btn btn-primary" style="margin-top:16px;">Back to Collections</a></div>', '', data));
  res.send(templates.renderSingleGallery(gallery, data));
});

// Route: Posts
app.get('/posts', (req, res) => {
  const data = loadData();
  res.send(templates.renderPosts(data));
});

app.get('/post/:slug', (req, res) => {
  const data = loadData();
  const post = data.posts.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).send(templates.layout('Article Not Found', '<div class="container" style="padding:60px 0; text-align:center;"><h2>Article not found</h2><a href="/posts" class="btn btn-primary" style="margin-top:16px;">Back to Guides</a></div>', '', data));
  res.send(templates.renderSinglePost(post, data));
});

// Route: Entry Rules
app.get('/entry-rules', (req, res) => {
  const data = loadData();
  res.send(templates.renderRulesPage(data));
});

// Route: Travel & Hotels Guide
app.get('/travel-guide', (req, res) => {
  const data = loadData();
  res.send(templates.renderTravelGuide(data));
});

// Route: Marriage Guide
app.get('/marriage-guide', (req, res) => {
  const data = loadData();
  const content = `
    <div class="container" style="padding-top: 40px; max-width: 900px;">
      <div class="section-header">
        <span class="section-tag">Auspicious Ceremonies</span>
        <h1 class="section-title">Guruvayur Temple Marriage / Kalyanam Guide</h1>
        <p class="section-subtitle">
          Complete procedure for solemnizing weddings at the sacred Kalyana Mandapam in front of the East Nada.
        </p>
      </div>

      <div class="article-main" style="margin-top:24px;">
        <h2 style="color:var(--primary); margin-bottom:16px;">Step-by-Step Marriage Booking Procedure</h2>
        <ol style="margin-left:20px; line-height:1.9; color:var(--text-main);">
          <li><strong>Devaswom Registration:</strong> Advance token registration is conducted through the official Devaswom marriage counter or via the Devaswom online portal with valid government IDs.</li>
          <li><strong>Mandapam Ceremony:</strong> Marriages are conducted at the Kalyana Mandapams situated directly in front of the East Nada (Kizhakkekotta).</li>
          <li><strong>Dress Code for Bride & Groom:</strong> Groom must wear traditional Mundu (shirtless or with Angavastram). Bride must wear traditional Kerala Saree / Kancheepuram Silk saree.</li>
          <li><strong>Thali & Garland Exchange:</strong> The auspicious ceremony consists of exchanging floral garlands, tying the sacred Mangalsutra (Thali), and receiving temple prasad.</li>
          <li><strong>Marriage Certificate:</strong> Following the temple ceremony, official certificates are issued by the Guruvayur Municipality office (located near East Nada) upon submitting Devaswom receipts and witness verification.</li>
        </ol>
      </div>
    </div>
  `;
  res.send(templates.layout('Marriage / Kalyanam Guide', content, 'guides', data));
});

// Route: Festivals
app.get('/festivals', (req, res) => {
  const data = loadData();
  // Find the Ulsavam post
  const ulsavamPost = data.posts.find(p => p.slug.includes('ulsavam')) || data.posts[0];
  res.redirect(`/post/${ulsavamPost.slug}`);
});

// Route: Legal & Informational
app.get('/about', (req, res) => {
  const data = loadData();
  res.send(templates.renderStaticPage('about', data));
});

app.get('/privacy-policy', (req, res) => {
  const data = loadData();
  res.send(templates.renderStaticPage('privacyPolicy', data));
});

app.get('/terms-and-conditions', (req, res) => {
  const data = loadData();
  res.send(templates.renderStaticPage('termsConditions', data));
});

app.get('/contact', (req, res) => {
  const data = loadData();
  const content = `
    <div class="container" style="padding-top: 40px; max-width: 800px;">
      <div class="article-main">
        <header class="article-header">
          <h1>Contact Editorial &amp; Support</h1>
          <p style="color:var(--text-muted);">Have a query, correction, or photo submission for Guruvayur Live? Reach out to us below.</p>
        </header>

        <div style="background:#f8fafc; padding:24px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:28px;">
          <h3 style="color:var(--primary); margin-bottom:12px;">Portal Editorial Desk:</h3>
          <p style="margin-bottom:8px;"><strong>Email:</strong> <a href="mailto:${data.config.contactEmail}">${data.config.contactEmail}</a></p>
          <p style="margin-bottom:8px;"><strong>Website:</strong> <a href="${data.config.siteUrl}">${data.config.siteUrl}</a></p>
          <p style="color:var(--text-muted); font-size:0.88rem;">We welcome devotee contributions, photo series, and verified festival announcements.</p>
        </div>

        <div style="background:#fefce8; padding:24px; border-radius:8px; border:1px solid #fef08a;">
          <h3 style="color:var(--gold-dark); margin-bottom:12px;">Official Temple Administration Contacts:</h3>
          <p style="font-size:0.9rem; line-height:1.7;">
            For official e-darshan, vazhipadu, or administrative enquiries, contact the Guruvayur Devaswom directly:<br>
            <strong>Official Website:</strong> <a href="https://guruvayurdevaswom.in" target="_blank" rel="noopener">guruvayurdevaswom.in</a><br>
            <strong>Devaswom Office:</strong> East Nada, Guruvayur, PIN - 680 101, Kerala.<br>
            <strong>Enquiry Helpline:</strong> +91 487 2556335 / 2556346
          </p>
        </div>
      </div>
    </div>
  `;
  res.send(templates.layout('Contact Editorial & Official Helpline', content, '', data));
});

// ==========================================
// REST API FOR ADMIN & CONTENT MANAGEMENT
// ==========================================

app.get('/api/content', (req, res) => {
  res.json(loadData());
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const data = loadData();
  const admin = data.config.admin;
  if (username === admin.username && password === admin.passwordHash) {
    return res.json({ success: true, message: 'Logged in successfully' });
  }
  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

app.post('/api/posts', (req, res) => {
  const data = loadData();
  const existingIndex = req.body.id ? data.posts.findIndex(p => p.id == req.body.id) : -1;

  const postObj = {
    id: existingIndex >= 0 ? data.posts[existingIndex].id : Date.now(),
    slug: req.body.slug,
    title: req.body.title,
    category: req.body.category || 'Guide',
    categories: [req.body.category || 'Guide'],
    featuredImage: req.body.featuredImage || '/images/uploads/Guruvayur-Temple-scaled.jpg',
    date: existingIndex >= 0 ? data.posts[existingIndex].date : (req.body.date || new Date().toISOString().split('T')[0]),
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    gallery: req.body.gallery || []
  };

  if (existingIndex >= 0) {
    data.posts[existingIndex] = postObj;
  } else {
    data.posts.unshift(postObj);
  }
  saveData(data);
  try { exportStaticSite(); } catch (e) {}
  res.json({ success: true, post: postObj });
});

app.delete('/api/posts/:id', (req, res) => {
  const data = loadData();
  const id = parseInt(req.params.id, 10);
  data.posts = data.posts.filter(p => p.id !== id);
  saveData(data);
  res.json({ success: true });
});

app.post('/api/galleries', (req, res) => {
  const data = loadData();
  const newGallery = {
    id: req.body.id || 'gallery-' + Date.now(),
    title: req.body.title,
    category: req.body.category || 'Festivals',
    description: req.body.description || '',
    coverImage: req.body.coverImage || (req.body.images && req.body.images[0] ? req.body.images[0].url : ''),
    date: req.body.date || new Date().toISOString().split('T')[0],
    images: req.body.images || []
  };

  data.galleries.unshift(newGallery);
  saveData(data);
  res.json({ success: true, gallery: newGallery });
});

app.delete('/api/galleries/:id', (req, res) => {
  const data = loadData();
  data.galleries = data.galleries.filter(g => g.id !== req.params.id);
  saveData(data);
  res.json({ success: true });
});

app.get('/api/media', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const media = files.map(file => ({
      name: file,
      url: `/images/uploads/${file}`
    }));
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload', (req, res) => {
  const { filename, data } = req.body;
  if (!filename || !data) return res.status(400).json({ success: false, message: 'Missing file data' });

  try {
    const cleanFilename = Date.now() + '-' + filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const dest = path.join(uploadsDir, cleanFilename);
    fs.writeFileSync(dest, buffer);

    res.json({ success: true, url: `/images/uploads/${cleanFilename}`, name: cleanFilename });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/settings', (req, res) => {
  const data = loadData();
  data.config = req.body;
  saveData(data);
  res.json({ success: true });
});

// Static Site Exporter for Cloudflare Pages / Vercel
app.post('/api/export-static', (req, res) => {
  try {
    exportStaticSite();
    res.json({ success: true, exportPath: distDir });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function generateSitemapXml(data) {
  const baseUrl = (data.config && data.config.siteUrl) || 'https://guruvayurlive.in';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  const corePages = [
    { loc: '/', priority: '1.0', changefreq: 'daily', img: '/images/uploads/Guruvayur-Temple-scaled.jpg', title: 'Guruvayur Temple Sree Krishna Shrine' },
    { loc: '/timings', priority: '0.95', changefreq: 'daily', title: 'Guruvayur Temple Daily Pooja Timings Schedule' },
    { loc: '/entry-rules', priority: '0.9', changefreq: 'weekly', title: 'Guruvayur Temple Entry Rules and Dress Code' },
    { loc: '/galleries', priority: '0.85', changefreq: 'weekly', title: 'Guruvayur Temple Photo Collections and Visual Archives' },
    { loc: '/posts', priority: '0.85', changefreq: 'daily', title: 'Guruvayur Temple Devotee Guides and Articles' },
    { loc: '/travel-guide', priority: '0.85', changefreq: 'monthly', title: 'How to Reach Guruvayur and Recommended Stays' },
    { loc: '/marriage-guide', priority: '0.8', changefreq: 'monthly', title: 'Guruvayur Temple Marriage Kalyanam Booking Procedure' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly', title: 'About Guruvayur Live' },
    { loc: '/contact', priority: '0.5', changefreq: 'monthly', title: 'Contact Guruvayur Live Editorial' },
    { loc: '/privacy-policy', priority: '0.4', changefreq: 'monthly', title: 'Privacy Policy' },
    { loc: '/terms-and-conditions', priority: '0.4', changefreq: 'monthly', title: 'Terms and Conditions' }
  ];

  corePages.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${p.loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    if (p.img) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${baseUrl}${p.img}</image:loc>\n`;
      xml += `      <image:title>${p.title}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  (data.posts || []).forEach(post => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/post/${post.slug}</loc>\n`;
    xml += `    <lastmod>${post.date || today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    if (post.featuredImage) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${baseUrl}${post.featuredImage}</image:loc>\n`;
      xml += `      <image:title>${post.title.replace(/&/g, '&amp;')}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  (data.galleries || []).forEach(gal => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/gallery/${gal.id}</loc>\n`;
    xml += `    <lastmod>${gal.date || today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    if (gal.coverImage) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${baseUrl}${gal.coverImage}</image:loc>\n`;
      xml += `      <image:title>${gal.title.replace(/&/g, '&amp;')}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

function exportStaticSite() {
  const data = loadData();
  fs.mkdirSync(distDir, { recursive: true });

  // Generate & export sitemap.xml, robots.txt, llms.txt
  const sitemapXml = generateSitemapXml(data);
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

  if (fs.existsSync(path.join(publicDir, 'robots.txt'))) {
    fs.copyFileSync(path.join(publicDir, 'robots.txt'), path.join(distDir, 'robots.txt'));
  }
  if (fs.existsSync(path.join(publicDir, 'llms.txt'))) {
    fs.copyFileSync(path.join(publicDir, 'llms.txt'), path.join(distDir, 'llms.txt'));
  }

  // Copy CSS, JS, ads.txt, images
  copyRecursiveSync(path.join(publicDir, 'css'), path.join(distDir, 'css'));
  copyRecursiveSync(path.join(publicDir, 'js'), path.join(distDir, 'js'));
  copyRecursiveSync(path.join(publicDir, 'images'), path.join(distDir, 'images'));
  fs.copyFileSync(path.join(publicDir, 'ads.txt'), path.join(distDir, 'ads.txt'));
  if (fs.existsSync(path.join(publicDir, 'favicon.svg'))) {
    fs.copyFileSync(path.join(publicDir, 'favicon.svg'), path.join(distDir, 'favicon.svg'));
    fs.copyFileSync(path.join(publicDir, 'favicon.svg'), path.join(distDir, 'favicon.ico'));
  }

  // Export Home
  fs.writeFileSync(path.join(distDir, 'index.html'), templates.renderHome(data), 'utf8');

  // Export Timings
  fs.mkdirSync(path.join(distDir, 'timings'), { recursive: true });
  fs.writeFileSync(path.join(distDir, 'timings', 'index.html'), templates.renderTimings(data), 'utf8');

  // Export Galleries
  fs.mkdirSync(path.join(distDir, 'galleries'), { recursive: true });
  fs.writeFileSync(path.join(distDir, 'galleries', 'index.html'), templates.renderGalleries(data), 'utf8');

  data.galleries.forEach(g => {
    const dir = path.join(distDir, 'gallery', g.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), templates.renderSingleGallery(g, data), 'utf8');
  });

  // Export Posts
  fs.mkdirSync(path.join(distDir, 'posts'), { recursive: true });
  fs.writeFileSync(path.join(distDir, 'posts', 'index.html'), templates.renderPosts(data), 'utf8');

  data.posts.forEach(p => {
    const dir = path.join(distDir, 'post', p.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), templates.renderSinglePost(p, data), 'utf8');
  });

  // Export Rules, Travel, Marriage, About, Privacy, Terms
  const staticPages = [
    { path: 'entry-rules', html: templates.renderRulesPage(data) },
    { path: 'travel-guide', html: templates.renderTravelGuide(data) },
    { path: 'about', html: templates.renderStaticPage('about', data) },
    { path: 'privacy-policy', html: templates.renderStaticPage('privacyPolicy', data) },
    { path: 'terms-and-conditions', html: templates.renderStaticPage('termsConditions', data) }
  ];

  staticPages.forEach(sp => {
    const dir = path.join(distDir, sp.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), sp.html, 'utf8');
  });

  console.log('Static site exported successfully into:', distDir);
}

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚩 Guruvayur Live Redesign Server Running!`);
  console.log(`🌐 Public Website: http://localhost:${PORT}`);
  console.log(`🔑 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`📄 AdSense ads.txt: http://localhost:${PORT}/ads.txt`);
  console.log(`====================================================`);
});

// Also export static files initially so dist/ is always ready
try {
  exportStaticSite();
} catch (e) {
  console.warn('Initial static export skipped:', e.message);
}
