/**
 * Guruvayur Live - Admin Dashboard Logic
 * Advanced Article Editor, Image Library Integration, Media Uploads & AdSense
 */

let siteData = null;
let selectedFeaturedImage = '';
let articleGalleryItems = [];
let standaloneGalleryItems = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initTabs();
  loadData();
  initImageUploaders();
});

function checkAuth() {
  const token = localStorage.getItem('gl_admin_token');
  const loginOverlay = document.getElementById('login-overlay');
  const adminApp = document.getElementById('admin-app');

  if (token === 'logged_in') {
    if (loginOverlay) loginOverlay.style.display = 'none';
    if (adminApp) adminApp.style.display = 'block';
  } else {
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (adminApp) adminApp.style.display = 'none';
  }
}

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const u = document.getElementById('login-user').value;
  const p = document.getElementById('login-pass').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    if (!res.ok) {
      const text = await res.text();
      let msg = text;
      try { msg = JSON.parse(text).message; } catch(e){}
      alert(msg || 'Invalid credentials');
      return;
    }
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('gl_admin_token', 'logged_in');
      checkAuth();
      loadData();
    } else {
      alert(data.message || 'Invalid credentials');
    }
  } catch (err) {
    alert('Server connection error: ' + err.message);
  }
});

function logout() {
  localStorage.removeItem('gl_admin_token');
  checkAuth();
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.style.display = 'block';
    });
  });
}

async function loadData() {
  try {
    const res = await fetch('/api/content');
    siteData = await res.json();
    renderOverview();
    renderMediaPickers();
    renderMediaLibrary();
    renderManageContent();
    renderSettings();
  } catch (err) {
    console.error('Error loading content:', err);
  }
}

function renderOverview() {
  document.getElementById('stat-posts-count').textContent = siteData.posts.length;
  document.getElementById('stat-galleries-count').textContent = siteData.galleries.length;
  document.getElementById('stat-adsense-status').textContent = siteData.config.adsense.enabled
    ? (siteData.config.adsense.testMode ? 'Active (Test Mode)' : 'Active (Live Ads)')
    : 'Disabled';
}

// Render media items for the Featured Image selector in article form
function renderMediaPickers() {
  const container = document.getElementById('featured-media-picker');
  if (!container) return;
  container.innerHTML = '';

  fetch('/api/media').then(r => r.json()).then(files => {
    document.getElementById('stat-media-count').textContent = files.length;
    files.forEach(f => {
      const item = document.createElement('div');
      item.className = 'media-picker-item' + (selectedFeaturedImage === f.url ? ' selected' : '');
      item.innerHTML = `<img src="${f.url}" alt="${f.name}" title="${f.name}">`;
      item.addEventListener('click', () => {
        selectFeaturedImage(f.url, f.name);
      });
      container.appendChild(item);
    });
  });
}

function selectFeaturedImage(url, name) {
  selectedFeaturedImage = url;
  document.querySelectorAll('#featured-media-picker .media-picker-item').forEach(el => el.classList.remove('selected'));
  
  const previewWrap = document.getElementById('featured-preview-wrap');
  const previewImg = document.getElementById('post-featured-preview');
  const previewUrl = document.getElementById('featured-preview-url');
  const filenameLabel = document.getElementById('selected-image-filename');

  if (previewWrap) previewWrap.style.display = 'flex';
  if (previewImg) previewImg.src = url;
  if (previewUrl) previewUrl.textContent = url;
  if (filenameLabel) filenameLabel.textContent = name || url.split('/').pop();
}

// Render full Media Library tab
function renderMediaLibrary() {
  const container = document.getElementById('media-library-grid');
  if (!container) return;
  container.innerHTML = '<p style="color:#64748b;">Loading media assets...</p>';

  fetch('/api/media').then(r => r.json()).then(files => {
    container.innerHTML = '';
    files.forEach(f => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.style.fontSize = '0.85rem';
      card.innerHTML = `
        <div class="gallery-thumb-wrap" style="aspect-ratio: 1; cursor:pointer;" onclick="copyToClipboard('${f.url}')">
          <img src="${f.url}" alt="${f.name}">
        </div>
        <div style="padding: 10px;">
          <strong style="display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${f.name}">${f.name}</strong>
          <button class="btn btn-outline" style="padding:4px 8px; font-size:0.75rem; width:100%; margin-top:8px; color:var(--primary); border-color:#cbd5e1;" onclick="copyToClipboard('${f.url}')">📋 Copy URL</button>
        </div>
      `;
      container.appendChild(card);
    });
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert('Copied image URL to clipboard:\n' + text);
}

// -------------------------------------------------------------
// IMAGE UPLOADER HANDLERS (Article Editor & Media Library Tab)
// -------------------------------------------------------------
function initImageUploaders() {
  // 1. Article Editor Upload (Uploads to library & auto-selects as featured image)
  const articleUpload = document.getElementById('article-image-upload');
  if (articleUpload) {
    articleUpload.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      for (const file of files) {
        await uploadFileToServer(file, (result) => {
          selectFeaturedImage(result.url, file.name);
        });
      }
      renderMediaPickers();
      renderMediaLibrary();
      alert(`Uploaded ${files.length} image(s) to Media Library successfully!`);
    });
  }

  // 2. Media Library Tab Upload
  const libUpload = document.getElementById('library-direct-upload');
  if (libUpload) {
    libUpload.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      for (const file of files) {
        await uploadFileToServer(file);
      }
      renderMediaPickers();
      renderMediaLibrary();
      alert(`Uploaded ${files.length} photo(s) to Media Library!`);
    });
  }

  // 3. Standalone Photo Collection Tab Upload
  const directUpload = document.getElementById('direct-file-upload');
  if (directUpload) {
    directUpload.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      for (const file of files) {
        await uploadFileToServer(file, (result) => {
          standaloneGalleryItems.push({
            url: result.url,
            caption: file.name.replace(/\.[^/.]+$/, "")
          });
        });
      }
      renderStandaloneGalleryUi();
      renderMediaPickers();
      renderMediaLibrary();
    });
  }
}

async function uploadFileToServer(file, callback) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target.result;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, data: base64 })
        });
        const result = await res.json();
        if (result.success && callback) {
          callback(result);
        }
        resolve(result);
      } catch (err) {
        console.error('Upload error:', err);
        resolve(null);
      }
    };
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// INSERT IMAGE MODAL (Inserts <figure> into Article textarea)
// -------------------------------------------------------------
function openInsertImageModal() {
  const modal = document.getElementById('insert-image-modal');
  const grid = document.getElementById('insert-modal-grid');
  if (!modal || !grid) return;

  grid.innerHTML = '<p style="color:#64748b;">Loading library images...</p>';
  modal.style.display = 'flex';

  fetch('/api/media').then(r => r.json()).then(files => {
    grid.innerHTML = files.map(f => `
      <div class="media-picker-item" onclick="insertImageIntoContent('${f.url}', '${f.name.replace(/'/g, "")}')">
        <img src="${f.url}" alt="${f.name}">
      </div>
    `).join('');
  });
}

function closeInsertImageModal() {
  const modal = document.getElementById('insert-image-modal');
  if (modal) modal.style.display = 'none';
}

function insertImageIntoContent(url, caption = 'Guruvayur Temple') {
  const textarea = document.getElementById('post-content');
  const cleanCaption = caption.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
  const figureHtml = `\n\n<figure style="margin: 28px 0; text-align: center;">\n  <img src="${url}" alt="${cleanCaption}" style="border-radius: 8px; width: 100%; max-width: 720px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">\n  <figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 8px; font-weight: 500;">Photo: ${cleanCaption}</figcaption>\n</figure>\n\n`;

  insertAtCursor(textarea, figureHtml);
  closeInsertImageModal();
}

function insertAtCursor(myField, myValue) {
  if (document.selection) {
    myField.focus();
    const sel = document.selection.createRange();
    sel.text = myValue;
  } else if (myField.selectionStart || myField.selectionStart === 0) {
    const startPos = myField.selectionStart;
    const endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
    myField.selectionStart = startPos + myValue.length;
    myField.selectionEnd = startPos + myValue.length;
  } else {
    myField.value += myValue;
  }
}

function insertHeadingHelper() {
  const textarea = document.getElementById('post-content');
  insertAtCursor(textarea, '\n\n<h2>Section Heading Title</h2>\n<p>Write your detailed information here...</p>\n\n');
}

function insertQuoteHelper() {
  const textarea = document.getElementById('post-content');
  insertAtCursor(textarea, '\n\n<div style="background:#fefce8; border-left:4px solid #d97706; padding:16px 20px; border-radius:4px; margin:24px 0;">\n  <strong>Devotee Tip:</strong> Important guidance or dress code advisory goes here.\n</div>\n\n');
}

// -------------------------------------------------------------
// ATTACH PHOTO GALLERY TO ARTICLE
// -------------------------------------------------------------
function openAttachGalleryModal() {
  const modal = document.getElementById('attach-gallery-modal');
  const grid = document.getElementById('attach-modal-grid');
  if (!modal || !grid) return;

  grid.innerHTML = '<p style="color:#64748b;">Loading library images...</p>';
  modal.style.display = 'flex';

  fetch('/api/media').then(r => r.json()).then(files => {
    grid.innerHTML = files.map(f => `
      <div class="media-picker-item" onclick="addPhotoToArticleGallery('${f.url}', '${f.name.replace(/'/g, "")}')">
        <img src="${f.url}" alt="${f.name}">
      </div>
    `).join('');
  });
}

function closeAttachGalleryModal() {
  const modal = document.getElementById('attach-gallery-modal');
  if (modal) modal.style.display = 'none';
}

function addPhotoToArticleGallery(url, caption = '') {
  articleGalleryItems.push({
    url,
    caption: caption.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ')
  });
  renderArticleGalleryUi();
  closeAttachGalleryModal();
}

function renderArticleGalleryUi() {
  const container = document.getElementById('article-gallery-items');
  if (!container) return;

  if (articleGalleryItems.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8; font-size:0.85rem; text-align:center; padding:10px 0;">No photos attached yet. Click "Add Photo to Article Gallery" below to pick images.</p>';
    return;
  }

  container.innerHTML = articleGalleryItems.map((img, idx) => `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px; background:#fff; padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
      <img src="${img.url}" style="width:60px; height:45px; object-fit:cover; border-radius:4px;">
      <input type="text" class="form-control" style="flex:1;" placeholder="Photo caption..." value="${img.caption}" onchange="articleGalleryItems[${idx}].caption = this.value">
      <button type="button" class="btn btn-outline" style="color:#dc2626; padding:6px 10px;" onclick="articleGalleryItems.splice(${idx}, 1); renderArticleGalleryUi();">Remove</button>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// STANDALONE GALLERY UI (Tab 3)
// -------------------------------------------------------------
function renderStandaloneGalleryUi() {
  const container = document.getElementById('gallery-items-builder');
  if (!container) return;

  if (standaloneGalleryItems.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8; font-size:0.85rem; text-align:center; padding:16px 0;">No photos added yet. Upload files above or pick from the Media Library.</p>';
    return;
  }

  container.innerHTML = standaloneGalleryItems.map((img, idx) => `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px; background:#f8fafc; padding:8px; border-radius:6px; border:1px solid #e2e8f0;">
      <img src="${img.url}" style="width:60px; height:45px; object-fit:cover; border-radius:4px;">
      <input type="text" class="form-control" style="flex:1;" placeholder="Photo caption / description" value="${img.caption}" onchange="standaloneGalleryItems[${idx}].caption = this.value">
      <button type="button" class="btn btn-outline" style="color:#dc2626; padding:6px 10px;" onclick="standaloneGalleryItems.splice(${idx}, 1); renderStandaloneGalleryUi();">Remove</button>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// ARTICLE FORM SUBMIT (Create & Edit)
// -------------------------------------------------------------
document.getElementById('create-post-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = document.getElementById('post-edit-id').value;
  const title = document.getElementById('post-title').value;
  const slug = document.getElementById('post-slug').value || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const category = document.getElementById('post-category').value;
  const excerpt = document.getElementById('post-excerpt').value;
  const content = document.getElementById('post-content').value;

  const payload = {
    id: editId ? parseInt(editId, 10) : undefined,
    title,
    slug,
    category,
    excerpt,
    content,
    featuredImage: selectedFeaturedImage || '/images/uploads/Guruvayur-Temple-scaled.jpg',
    gallery: articleGalleryItems,
    date: new Date().toISOString().split('T')[0]
  };

  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      alert(editId ? 'Article updated successfully!' : 'Article published successfully!');
      resetArticleForm();
      loadData();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    alert('Failed to save article: ' + err.message);
  }
});

function editPost(id) {
  const post = siteData.posts.find(p => p.id === id);
  if (!post) return;

  document.getElementById('article-form-title').textContent = 'Edit Article: ' + post.title;
  document.getElementById('post-edit-id').value = post.id;
  document.getElementById('post-title').value = post.title;
  document.getElementById('post-slug').value = post.slug;
  document.getElementById('post-category').value = post.category;
  document.getElementById('post-excerpt').value = post.excerpt;
  document.getElementById('post-content').value = post.content;
  document.getElementById('btn-submit-article').textContent = 'Update Article & Re-publish';
  document.getElementById('btn-cancel-edit').style.display = 'inline-block';

  selectFeaturedImage(post.featuredImage, post.featuredImage.split('/').pop());
  articleGalleryItems = post.gallery || [];
  renderArticleGalleryUi();

  // Switch to Article tab
  document.querySelector('[data-tab=tab-new-post]').click();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetArticleForm() {
  document.getElementById('create-post-form').reset();
  document.getElementById('post-edit-id').value = '';
  document.getElementById('article-form-title').textContent = 'Publish New Article & Attach Images';
  document.getElementById('btn-submit-article').textContent = 'Publish Article to Live Site';
  document.getElementById('btn-cancel-edit').style.display = 'none';
  selectedFeaturedImage = '';
  articleGalleryItems = [];
  renderArticleGalleryUi();
  const previewWrap = document.getElementById('featured-preview-wrap');
  if (previewWrap) previewWrap.style.display = 'none';
}

// -------------------------------------------------------------
// STANDALONE GALLERY FORM SUBMIT
// -------------------------------------------------------------
document.getElementById('create-gallery-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('gallery-title').value;
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const category = document.getElementById('gallery-category').value;
  const description = document.getElementById('gallery-desc').value;

  if (standaloneGalleryItems.length === 0) {
    alert('Please upload or add at least one photo to this collection.');
    return;
  }

  const payload = {
    id,
    title,
    category,
    description,
    coverImage: standaloneGalleryItems[0].url,
    date: new Date().toISOString().split('T')[0],
    images: standaloneGalleryItems
  };

  try {
    const res = await fetch('/api/galleries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      alert('Photo Collection saved and published successfully!');
      document.getElementById('create-gallery-form').reset();
      standaloneGalleryItems = [];
      renderStandaloneGalleryUi();
      loadData();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    alert('Failed to save gallery: ' + err.message);
  }
});

// -------------------------------------------------------------
// MANAGE CONTENT TABLE
// -------------------------------------------------------------
function renderManageContent() {
  const postsTable = document.getElementById('manage-posts-table');
  const galleriesTable = document.getElementById('manage-galleries-table');

  if (postsTable) {
    postsTable.innerHTML = siteData.posts.map(p => `
      <tr>
        <td><img src="${p.featuredImage}" style="width:50px; height:35px; object-fit:cover; border-radius:4px;"></td>
        <td><strong>${p.title}</strong><br><small style="color:#64748b;">${p.slug}</small></td>
        <td><span class="section-tag" style="padding:2px 8px; font-size:0.75rem;">${p.category}</span></td>
        <td>${p.date}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-outline" style="padding:4px 8px; font-size:0.8rem; color:var(--primary); border-color:#cbd5e1;" onclick="editPost(${p.id})">Edit</button>
            <button class="btn btn-outline" style="padding:4px 8px; font-size:0.8rem; color:#dc2626; border-color:#fca5a5;" onclick="deletePost(${p.id})">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (galleriesTable) {
    galleriesTable.innerHTML = siteData.galleries.map(g => `
      <tr>
        <td><img src="${g.coverImage}" style="width:50px; height:35px; object-fit:cover; border-radius:4px;"></td>
        <td><strong>${g.title}</strong><br><small style="color:#64748b;">${g.images ? g.images.length : 0} Photos</small></td>
        <td><span class="section-tag" style="padding:2px 8px; font-size:0.75rem;">${g.category}</span></td>
        <td>${g.date}</td>
        <td>
          <button class="btn btn-outline" style="padding:4px 10px; font-size:0.8rem; color:#dc2626; border-color:#fca5a5;" onclick="deleteGallery('${g.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }
}

async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.success) loadData();
}

async function deleteGallery(id) {
  if (!confirm('Are you sure you want to delete this photo collection?')) return;
  const res = await fetch(`/api/galleries/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.success) loadData();
}

// -------------------------------------------------------------
// SETTINGS & ADSENSE
// -------------------------------------------------------------
function renderSettings() {
  const cfg = siteData.config;
  document.getElementById('setting-site-title').value = cfg.siteTitle || '';
  document.getElementById('setting-tagline').value = cfg.tagline || '';
  document.getElementById('setting-announcement').value = cfg.announcement.text || '';
  document.getElementById('setting-announcement-enabled').checked = cfg.announcement.enabled;

  const ads = cfg.adsense;
  document.getElementById('setting-ads-enabled').checked = ads.enabled;
  document.getElementById('setting-ads-testmode').checked = ads.testMode;
  document.getElementById('setting-ads-pubid').value = ads.publisherId || '';
  document.getElementById('setting-slot-header').checked = ads.slots.headerBanner;
  document.getElementById('setting-slot-article').checked = ads.slots.inArticleBanner;
  document.getElementById('setting-slot-sidebar').checked = ads.slots.sidebarBanner;
  document.getElementById('setting-slot-footer').checked = ads.slots.stickyFooter;
}

document.getElementById('settings-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cfg = siteData.config;

  cfg.siteTitle = document.getElementById('setting-site-title').value;
  cfg.tagline = document.getElementById('setting-tagline').value;
  cfg.announcement.enabled = document.getElementById('setting-announcement-enabled').checked;
  cfg.announcement.text = document.getElementById('setting-announcement').value;

  cfg.adsense.enabled = document.getElementById('setting-ads-enabled').checked;
  cfg.adsense.testMode = document.getElementById('setting-ads-testmode').checked;
  cfg.adsense.publisherId = document.getElementById('setting-ads-pubid').value;
  cfg.adsense.slots.headerBanner = document.getElementById('setting-slot-header').checked;
  cfg.adsense.slots.inArticleBanner = document.getElementById('setting-slot-article').checked;
  cfg.adsense.slots.sidebarBanner = document.getElementById('setting-slot-sidebar').checked;
  cfg.adsense.slots.stickyFooter = document.getElementById('setting-slot-footer').checked;

  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg)
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Status ${res.status}: ${errText.substring(0, 100)}`);
    }
    const data = await res.json();
    if (data.success) {
      alert('Settings & AdSense configurations updated successfully!');
      loadData();
    }
  } catch (err) {
    alert('Error saving settings: ' + err.message);
  }
});

// -------------------------------------------------------------
// STATIC SITE EXPORT
// -------------------------------------------------------------
async function triggerStaticExport() {
  const btn = document.getElementById('btn-export-static');
  btn.textContent = 'Exporting site...';
  try {
    const res = await fetch('/api/export-static', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      alert(`Static export complete! Files generated in:\n${data.exportPath}\n\nYou can now upload the contents of this folder directly to Cloudflare Pages or Vercel.`);
    } else {
      alert('Export failed: ' + data.message);
    }
  } catch (err) {
    alert('Error triggering export: ' + err.message);
  } finally {
    btn.textContent = 'Generate 1-Click Static Export (for Cloudflare / Vercel)';
  }
}
