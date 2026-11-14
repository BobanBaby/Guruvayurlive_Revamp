/**
 * Guruvayur Live - Client Scripts
 * Handles Live Darshan Status (IST), Lightbox, Mobile Nav & AdSense slots
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveStatusTracker();
  initQuickSearch();
  initLightbox();
  initMobileNav();
  initStickyAd();
});

// Quick Finder Instant Search
function initQuickSearch() {
  const input = document.getElementById('header-search-input');
  const results = document.getElementById('header-search-results');
  if (!input || !results) return;

  const quickIndex = [
    { title: 'Nirmalyam & Daily Pooja Timings', url: '/timings', type: 'Timings', keywords: 'nirmalyam seeveli ucha pooja vakacharthu deeparadhana morning evening hours schedule' },
    { title: 'Traditional Dress Code Guidelines', url: '/entry-rules', type: 'Rules', keywords: 'dress code mundu dhoti saree churidar salwar pants jeans clothes wear' },
    { title: 'Mobile Phone, Camera & Cloakroom Rules', url: '/entry-rules', type: 'Rules', keywords: 'mobile phone camera reels footwear chappal shoes cloakroom electronics' },
    { title: 'Guruvayur Ulsavam 2026 Festival Schedule', url: '/post/guruvayur-ulsavam-2026-complete-festival-schedule-rituals-kodiyettam-arattu-details', type: 'Festival', keywords: 'ulsavam 2026 kodiyettam aarattu pallivetta dates chenda melam procession' },
    { title: 'Marriage / Kalyanam Booking Procedure', url: '/marriage-guide', type: 'Ceremony', keywords: 'marriage kalyanam wedding mandapam token thali ceremony municipality certificate' },
    { title: 'Where to Stay: Hotels near East & West Nada', url: '/travel-guide', type: 'Hotels', keywords: 'hotels lodges rooms stay east nada west nada devaswom guest house accommodation' },
    { title: 'Reaching Guruvayur by Train & Flights', url: '/travel-guide', type: 'Travel', keywords: 'train station railway airport cochin kochi thrissur bus taxi auto' },
    { title: 'Photo Collection: Temple Architecture & Gopuram', url: '/gallery/guruvayur-temple-architecture', type: 'Gallery', keywords: 'photos pictures architecture gopuram sanctum deepasthambham images' },
    { title: 'Photo Collection: Caparisoned Elephant Processions', url: '/gallery/ulsavam-festival-processions', type: 'Gallery', keywords: 'elephants seeveli procession photos chenda melam tusker nettypattam' },
    { title: 'Punnathurkotta (Anakkotta) Elephant Sanctuary', url: '/gallery/punnathurkotta-elephant-sanctuary', type: 'Travel', keywords: 'punnathurkotta anakkotta elephant sanctuary palace camp visit timings' },
    { title: 'History & Origins of Guruvayur Temple', url: '/post/history-of-guruvayur-temple', type: 'History', keywords: 'history origin brihaspati vayu idol krishna bhuloka vaikuntham' },
    { title: 'Top 3 Travel Tips & Darshan Insights', url: '/post/guruvayur-temple-informations', type: 'Guide', keywords: 'tips advice crowds line queue darshan senior citizens pass' }
  ];

  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q || q.length < 2) {
      results.style.display = 'none';
      results.innerHTML = '';
      return;
    }

    const matches = quickIndex.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    ).slice(0, 5);

    if (matches.length === 0) {
      results.innerHTML = '<div style="padding:10px; font-size:0.85rem; color:#64748b; text-align:center;">No direct guides found. Try searching "timings", "dress code", or "rooms".</div>';
      results.style.display = 'block';
      return;
    }

    results.innerHTML = matches.map(m => `
      <a href="${m.url}">
        <span class="search-dropdown-title">${m.title}</span>
        <span class="search-dropdown-meta">${m.type} &bull; Click to open guide</span>
      </a>
    `).join('');
    results.style.display = 'block';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.style.display = 'none';
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') results.style.display = 'none';
  });
}

// Calculate Temple Status in Indian Standard Time (IST - UTC+5:30)
function initLiveStatusTracker() {
  const statusEl = document.getElementById('live-temple-status');
  if (!statusEl) return;

  function update() {
    // Current time in UTC converted to IST (UTC + 5 hours 30 mins)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istDate = new Date(utc + (3600000 * 5.5));

    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();
    const currentTimeMinutes = hours * 60 + minutes;

    // Morning Session: 3:00 AM (180 mins) to 1:30 PM (810 mins)
    // Evening Session: 4:30 PM (990 mins) to 9:30 PM (1290 mins)
    let isOpen = false;
    let ritualText = '';
    let nextEvent = '';

    if (currentTimeMinutes >= 180 && currentTimeMinutes < 810) {
      isOpen = true;
      if (currentTimeMinutes < 200) ritualText = 'Nirmalya Darshan (Sanctum Opened)';
      else if (currentTimeMinutes < 255) ritualText = 'Thailabhishekam & Vakacharthu';
      else if (currentTimeMinutes < 375) ritualText = 'Ethruthu Pooja & Morning Darshan';
      else if (currentTimeMinutes < 420) ritualText = 'Morning Seeveli (Elephant Procession)';
      else if (currentTimeMinutes < 540) ritualText = 'Pantheeradi Nivedyam & Continuous Darshan';
      else if (currentTimeMinutes < 750) ritualText = 'Navakabhishekam & Ucha Pooja';
      else ritualText = 'Afternoon Darshan (Closing at 1:30 PM)';
      nextEvent = 'Afternoon Nada Adakkal at 1:30 PM';
    } else if (currentTimeMinutes >= 990 && currentTimeMinutes < 1290) {
      isOpen = true;
      if (currentTimeMinutes < 1020) ritualText = 'Nada Thurakkal (Evening Opening) & Seeveli';
      else if (currentTimeMinutes < 1125) ritualText = 'Grand Deeparadhana (Lamp Illumination)';
      else if (currentTimeMinutes < 1185) ritualText = 'Athazha Pooja Nivedyam';
      else if (currentTimeMinutes < 1245) ritualText = 'Athazha Pooja & Night Darshan';
      else if (currentTimeMinutes < 1275) ritualText = 'Thrippuka Herbal Incense Rites';
      else ritualText = 'Harivarasanam & Nada Adakkal (9:15-9:30 PM)';
      nextEvent = 'Night Closing at 9:30 PM';
    } else if (currentTimeMinutes >= 810 && currentTimeMinutes < 990) {
      isOpen = false;
      ritualText = 'Afternoon Intermission (Temple Closed)';
      nextEvent = 'Evening Reopening (Nada Thurakkal) at 4:30 PM';
    } else {
      isOpen = false;
      ritualText = 'Night Closing (Sanctum Closed)';
      nextEvent = 'Early Morning Nirmalya Darshan at 3:00 AM';
    }

    const timeStr = istDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    statusEl.innerHTML = `
      <div class="status-indicator">
        <span class="pulse-dot ${isOpen ? '' : 'closed'}"></span>
        <span>TEMPLE STATUS: <strong style="color: ${isOpen ? '#15803d' : '#b45309'};">${isOpen ? 'OPEN FOR DARSHAN' : 'CURRENTLY CLOSED'}</strong></span>
      </div>
      <div class="status-timing-text">
        Current Ritual: <strong>${ritualText}</strong> | Next: <strong>${nextEvent}</strong> | IST: <em>${timeStr}</em>
      </div>
    `;
  }

  update();
  setInterval(update, 30000); // refresh every 30s
}

// Lightbox modal logic
let activeGalleryImages = [];
let currentImageIndex = 0;

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-prev');
  const nextBtn = modal.querySelector('.lightbox-next');
  const imgEl = modal.querySelector('#lightbox-img');
  const capEl = modal.querySelector('#lightbox-caption');

  window.openLightbox = function(images, startIndex = 0) {
    activeGalleryImages = images;
    currentImageIndex = startIndex;
    render();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function render() {
    if (!activeGalleryImages.length) return;
    const item = activeGalleryImages[currentImageIndex];
    imgEl.src = item.url;
    capEl.textContent = item.caption || `Image ${currentImageIndex + 1} of ${activeGalleryImages.length}`;
  }

  function close() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prev() {
    if (!activeGalleryImages.length) return;
    currentImageIndex = (currentImageIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length;
    render();
  }

  function next() {
    if (!activeGalleryImages.length) return;
    currentImageIndex = (currentImageIndex + 1) % activeGalleryImages.length;
    render();
  }

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-img-wrap')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}

// Mobile navigation menu toggle
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// Sticky mobile footer ad close button
function initStickyAd() {
  const closeBtn = document.querySelector('.sticky-ad-close');
  const stickyAd = document.querySelector('.sticky-footer-ad');
  if (closeBtn && stickyAd) {
    closeBtn.addEventListener('click', () => {
      stickyAd.style.display = 'none';
    });
  }
}
