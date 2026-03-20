/* ============================================================
   SCRIPT.JS — Mangalam HDPE Pipes
   Sections:
   1. Sticky Header Logic
   2. Mobile Navbar Toggle
   3. Image Carousel
   4. Zoom on Hover (Carousel)
============================================================ */

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
    'assets/images/product-main.jpg',
    'assets/images/product-main.jpg', // replace with product-2.jpg, etc.
    'assets/images/product-main.jpg',
    'assets/images/product-main.jpg',
    'assets/images/product-main.jpg',
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