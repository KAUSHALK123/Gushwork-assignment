/* =============GITHUB:KAUSHALK123=============================
   SCRIPT.JS — Mangalam HDPE Pipes
   Sections:
   1. Sticky Header Logic
   2. Mobile Navbar Toggle
   3. Image Carousel
   4. Zoom on Hover (Carousel)
=============GITHUB:KAUSHALK123============================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. STICKY HEADER
     Shows a fixed bar above the navbar when the user
     scrolls past the first fold (hero section height).
  ────────────────────────────────────────────── */
  const stickyHeader = document.getElementById('stickyHeader');
  const navbar       = document.getElementById('navbar');
  const heroSection  = document.getElementById('heroSection');

  if (stickyHeader && heroSection) {
    const STICKY_OFFSET = heroSection.offsetTop + 80; // trigger after 80px into hero

    const handleScroll = () => {
      if (window.scrollY > STICKY_OFFSET) {
        stickyHeader.classList.add('is-visible');
        navbar.classList.add('sticky-pushed');
      } else {
        stickyHeader.classList.remove('is-visible');
        navbar.classList.remove('sticky-pushed');
      }
    };

    // Use passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
  }


  /* ──────────────────────────────────────────────
     2. MOBILE NAVBAR TOGGLE
     Hamburger button shows/hides the nav menu on
     screens below 768px.
  ────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);

      // Animate hamburger → X
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      }
    });
  }


  /* ──────────────────────────────────────────────
     3. IMAGE CAROUSEL
     - Prev/Next arrows to cycle images
     - Thumbnail click to jump to image
     - Active thumbnail highlight
     - Smooth image transition
  ────────────────────────────────────────────── */

  // Array of image sources — add real paths as you export images
  const carouselImages = [
    'assets/images/hdpe.jpg',
    'assets/images/hdpe.jpg',
    'assets/images/ind1.jpeg',
    'assets/images/ind2.jpg',
    'assets/images/ind3.jpeg',
];

  let currentIndex = 0;

  const mainImage   = document.getElementById('mainImage');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const thumbBtns   = document.querySelectorAll('.carousel__thumb');
  const zoomPreviewImg = document.getElementById('zoomPreviewImg');

  /**
   * Updates the main carousel image and active thumbnail
   * @param {number} index - target image index
   */
  const goToSlide = (index) => {
    // Wrap around
    currentIndex = (index + carouselImages.length) % carouselImages.length;

    // Fade transition
    if (mainImage) {
      mainImage.style.opacity = '0';
      setTimeout(() => {
        mainImage.src = carouselImages[currentIndex];
        if (zoomPreviewImg) zoomPreviewImg.src = carouselImages[currentIndex];
        mainImage.style.opacity = '1';
      }, 150);
    }

    // Update active thumbnail
    thumbBtns.forEach((btn, i) => {
      btn.classList.toggle('carousel__thumb--active', i === currentIndex);
    });
  };

  // Add fade transition style to image
  if (mainImage) {
    mainImage.style.transition = 'opacity 0.15s ease';
  }

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Thumbnail clicks
  thumbBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => goToSlide(i));
  });

  // Keyboard navigation when carousel is focused
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });


  /* ──────────────────────────────────────────────
     4. ZOOM ON HOVER
     When hovering over the main carousel image:
     - Shows a zoom-lens box that follows the cursor
     - Displays a magnified preview in the zoom-preview panel
     - Preview panel appears to the right (or above on mobile)
  ────────────────────────────────────────────── */

  const imageContainer = document.getElementById('imageContainer');
  const zoomLens       = document.getElementById('zoomLens');
  const zoomPreview    = document.getElementById('zoomPreview');
  const zoomImg        = document.getElementById('mainImage');
  const previewImg     = document.getElementById('zoomPreviewImg');

  if (imageContainer && zoomLens && zoomPreview && zoomImg && previewImg) {

    const ZOOM_FACTOR = 2.5; // magnification level
    const LENS_SIZE   = 120; // px — must match CSS .zoom-lens width/height

    /**
     * Calculates zoom lens position and updates the preview image offset
     * @param {MouseEvent} e
     */
    const updateZoom = (e) => {
      const rect = imageContainer.getBoundingClientRect();
      const previewX = imageContainer.getBoundingClientRect().right + 16;
      const previewY = imageContainer.getBoundingClientRect().top;
      zoomPreview.style.left = previewX + 'px';
      zoomPreview.style.top = previewY + 'px';
      // Cursor position relative to image container
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // Clamp lens so it doesn't go outside the image
      const halfLens = LENS_SIZE / 2;
      x = Math.max(halfLens, Math.min(x, rect.width  - halfLens));
      y = Math.max(halfLens, Math.min(y, rect.height - halfLens));

      // Move lens (centered on cursor)
      zoomLens.style.left = `${x}px`;
      zoomLens.style.top  = `${y}px`;

      // Calculate the ratio of cursor position on the image
      const ratioX = (x - halfLens) / (rect.width  - LENS_SIZE);
      const ratioY = (y - halfLens) / (rect.height - LENS_SIZE);

      // Preview panel dimensions
      const previewW = zoomPreview.offsetWidth;
      const previewH = zoomPreview.offsetHeight;

      // Full zoomed image size
      const zoomedW = rect.width  * ZOOM_FACTOR;
      const zoomedH = rect.height * ZOOM_FACTOR;

      // Offset to pan the zoomed image inside the preview
      const offsetX = -(ratioX * (zoomedW - previewW));
      const offsetY = -(ratioY * (zoomedH - previewH));

      // Apply to preview image
      previewImg.style.width     = `${zoomedW}px`;
      previewImg.style.height    = `${zoomedH}px`;
      previewImg.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    };

    // Show zoom on mouse enter
    imageContainer.addEventListener('mouseenter', () => {
      zoomPreview.classList.add('is-visible');
    });

    // Update zoom position on mouse move
    imageContainer.addEventListener('mousemove', updateZoom);

    // Hide zoom on mouse leave
    imageContainer.addEventListener('mouseleave', () => {
      zoomPreview.classList.remove('is-visible');
    });

    // Touch: disable zoom on touch devices (show carousel normally)
    imageContainer.addEventListener('touchstart', () => {
      zoomPreview.classList.remove('is-visible');
    }, { passive: true });
  }

}); // end DOMContentLoaded


/* DOWNLOAD MODAL — shared across all sections */
const downloadModal = document.getElementById('downloadModal');
const modalClose    = document.getElementById('modalClose');
const modalSubmit   = document.getElementById('modalSubmit');

const openModal = () => {
  downloadModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  downloadModal.classList.remove('is-open');
  document.body.style.overflow = '';
};

// All download buttons across all sections trigger this modal
document.querySelectorAll('[id^="downloadBtn"], .js-download-trigger').forEach(btn => {
  btn.addEventListener('click', openModal);
});

if (modalClose) modalClose.addEventListener('click', closeModal);

// Close on overlay click
if (downloadModal) {
  downloadModal.addEventListener('click', (e) => {
    if (e.target === downloadModal) closeModal();
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Form submit
if (modalSubmit) {
  modalSubmit.addEventListener('click', () => {
    const email = document.getElementById('modalEmail');
    if (!email.value || !email.value.includes('@')) {
      email.focus();
      email.style.borderColor = '#EF4444';
      return;
    }
    email.style.borderColor = '';
    closeModal();
  });
}
/* FAQ ACCORDION */
document.querySelectorAll('.faq-item__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-item__btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('is-open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('is-open');
    }
  });
});

/* SECTION 5: APPLICATIONS CAROUSEL */
const appTrack = document.getElementById('appTrack');
const appPrev = document.getElementById('appPrev');
const appNext = document.getElementById('appNext');
const appWrapper = document.getElementById('appTrackWrapper');

if (appTrack && appPrev && appNext && appWrapper) {
  const originalCards = Array.from(appTrack.querySelectorAll('.app-card'));
  const total = originalCards.length;

  originalCards.forEach(card => {
    appTrack.appendChild(card.cloneNode(true));
    appTrack.insertBefore(card.cloneNode(true), appTrack.firstChild);
  });

  const allCards = appTrack.querySelectorAll('.app-card');
  const cardWidth = originalCards[0].offsetWidth + 32;
  let currentIndex = total;

  const jumpTo = (index, animate) => {
    appTrack.style.transition = animate ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    appTrack.style.transform = `translateX(-${index * cardWidth}px)`;
  };

  jumpTo(currentIndex, false);

  appNext.addEventListener('click', () => {
    currentIndex++;
    jumpTo(currentIndex, true);
    setTimeout(() => {
      if (currentIndex >= total * 2) {
        currentIndex = total;
        jumpTo(currentIndex, false);
      }
    }, 420);
  });

  appPrev.addEventListener('click', () => {
    currentIndex--;
    jumpTo(currentIndex, true);
    setTimeout(() => {
      if (currentIndex < total) {
        currentIndex = total * 2 - 1;
        jumpTo(currentIndex, false);
      }
    }, 420);
  });

  let isDragging = false;
  let startX = 0;
  let startPos = 0;

  appWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startPos = currentIndex * cardWidth;
    appTrack.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = startPos - (e.clientX - startX);
    appTrack.style.transform = `translateX(-${delta}px)`;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const delta = startPos - (e.clientX - startX);
    currentIndex = Math.round(delta / cardWidth);
    jumpTo(currentIndex, true);
  });

  appWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startPos = currentIndex * cardWidth;
    appTrack.style.transition = 'none';
  }, { passive: true });

  appWrapper.addEventListener('touchmove', (e) => {
    const delta = startPos - (e.touches[0].clientX - startX);
    appTrack.style.transform = `translateX(-${delta}px)`;
  }, { passive: true });

  appWrapper.addEventListener('touchend', (e) => {
    const delta = startPos - (e.changedTouches[0].clientX - startX);
    currentIndex = Math.round(delta / cardWidth);
    jumpTo(currentIndex, true);
  });
}

/* SECTION 6: MANUFACTURING PROCESS TABS */
const tabData = {
  raw: {
    title: 'High-Grade Raw Material Selection',
    desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
    points: ['PE100 grade material', 'Optimal molecular weight distribution'],
    image: 'assets/images/hdpe.jpg'
  },
  extrusion: {
    title: 'Precision Extrusion Process',
    desc: 'Our advanced extruders melt and shape HDPE resin at optimal temperatures, ensuring consistent melt flow and uniform pipe wall formation throughout production.',
    points: ['Temperature-controlled barrel zones', 'Consistent melt pressure monitoring'],
    image: 'assets/images/ind1.jpeg'
  },
  cooling: {
    title: 'Controlled Cooling System',
    desc: 'Pipes pass through calibrated water cooling tanks that gradually reduce temperature, locking in dimensional accuracy and preventing warping or deformation.',
    points: ['Multi-stage water cooling tanks', 'Precise temperature gradient control'],
    image: 'assets/images/ind2.jpg'
  },
  sizing: {
    title: 'Accurate Pipe Sizing',
    desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity across all pipe sizes.',
    points: ['Vacuum calibration sleeves', 'Real-time diameter measurement'],
    image: 'assets/images/ind3.jpeg'
  },
  quality: {
    title: 'Rigorous Quality Control',
    desc: 'Every pipe undergoes comprehensive testing including pressure tests, dimensional checks, and material property verification to meet international standards.',
    points: ['ISO 4427 compliance testing', 'Hydrostatic pressure verification'],
    image: 'assets/images/hdpe.jpg'
  },
  marking: {
    title: 'Permanent Pipe Marking',
    desc: 'Inkjet printing systems apply permanent identification markings including pipe specifications, standards compliance, and production batch information.',
    points: ['UV-resistant ink marking', 'Full traceability batch coding'],
    image: 'assets/images/ind1.jpeg'
  },
  cutting: {
    title: 'Precision Pipe Cutting',
    desc: 'Automated cutting systems ensure clean, square pipe ends at exact specified lengths, ready for immediate installation or further processing.',
    points: ['Automated length measurement', 'Clean burr-free cut ends'],
    image: 'assets/images/ind2.jpg'
  },
  packaging: {
    title: 'Protective Packaging & Dispatch',
    desc: 'Finished pipes are carefully packaged using protective materials to prevent damage during transport and storage, ensuring they arrive in perfect condition.',
    points: ['UV-protective wrapping', 'Secure bundling for transport'],
    image: 'assets/images/ind3.jpeg'
  }
};

const processTabs = document.getElementById('processTabs');
const processTitle = document.getElementById('processTitle');
const processDesc = document.getElementById('processDesc');
const processList = document.getElementById('processList');
const processImg = document.getElementById('processImg');

let lastTabIndex = 0;

if (processTabs && processTitle) {
  const tabs = Array.from(processTabs.querySelectorAll('.process-tab'));

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      const direction = i > lastTabIndex ? 1 : -1;
      lastTabIndex = i;

      tabs.forEach(t => t.classList.remove('process-tab--active'));
      tab.classList.add('process-tab--active');

      const data = tabData[tab.dataset.tab];
      if (!data) return;

      const slideOut = direction === 1 ? '40px' : '-40px';
      const slideIn = direction === 1 ? '-40px' : '40px';

      processTitle.style.transition = 'none';
      processDesc.style.transition = 'none';
      processList.style.transition = 'none';
      processImg.style.transition = 'none';

      processTitle.style.opacity = '0';
      processTitle.style.transform = `translateX(${slideOut})`;
      processDesc.style.opacity = '0';
      processDesc.style.transform = `translateX(${slideOut})`;
      processList.style.opacity = '0';
      processList.style.transform = `translateX(${slideOut})`;
      processImg.style.opacity = '0';
      processImg.style.transform = `translateX(${direction === 1 ? '40px' : '-40px'})`;

      setTimeout(() => {
        processTitle.textContent = data.title;
        processDesc.textContent = data.desc;
        processList.innerHTML = data.points.map(p =>
          `<li><span class="process-content__bullet"></span>${p}</li>`
        ).join('');
        processImg.src = data.image;

        processTitle.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        processDesc.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        processList.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        processImg.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

        processTitle.style.transform = `translateX(${slideIn})`;
        processDesc.style.transform = `translateX(${slideIn})`;
        processList.style.transform = `translateX(${slideIn})`;
        processImg.style.transform = `translateX(${direction === 1 ? '-40px' : '40px'})`;

        requestAnimationFrame(() => {
          processTitle.style.opacity = '1';
          processTitle.style.transform = 'translateX(0)';
          processDesc.style.opacity = '1';
          processDesc.style.transform = 'translateX(0)';
          processList.style.opacity = '1';
          processList.style.transform = 'translateX(0)';
          processImg.style.opacity = '1';
          processImg.style.transform = 'translateX(0)';
        });
      }, 220);
    });
  });
}

/* SECTION 7: TESTIMONIALS INFINITE LOOP */
const testimonialsTrack = document.getElementById('testimonialsTrack');
if (testimonialsTrack) {
  const cards = testimonialsTrack.innerHTML;
  testimonialsTrack.innerHTML = cards + cards;
}

const callbackModal = document.getElementById('callbackModal');
const callbackModalClose = document.getElementById('callbackModalClose');
const callbackSubmit = document.getElementById('callbackSubmit');

const openCallbackModal = () => {
  callbackModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

const closeCallbackModal = () => {
  callbackModal.classList.remove('is-open');
  document.body.style.overflow = '';
};

document.querySelectorAll('.js-callback-trigger').forEach(btn => {
  btn.addEventListener('click', openCallbackModal);
});

if (callbackModalClose) callbackModalClose.addEventListener('click', closeCallbackModal);

if (callbackModal) {
  callbackModal.addEventListener('click', (e) => {
    if (e.target === callbackModal) closeCallbackModal();
  });
}

if (callbackSubmit) {
  callbackSubmit.addEventListener('click', closeCallbackModal);
}