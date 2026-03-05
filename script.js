/* =========================================================
   DOM ELEMENT REFERENCES
   Cached at the top level so all modules can access them.
   ========================================================= */
const header           = document.getElementById("header");
const desktopDropdown  = document.getElementById("desktopDropdown");
const menuBtn          = document.getElementById("menuBtn");
const mobileMenu       = document.getElementById("mobileMenu");
const mobileDropdownBtn = document.getElementById("mobileDropdownBtn");
const mobileDropdown   = document.getElementById("mobileDropdown");


/* =========================================================
   STICKY HEADER — SCROLL BEHAVIOUR
   - Adds .scrolled class after 50px scroll (for shadow/shrink effect)
   - Past the first fold (100vh):
       • Scrolling UP  → shows header (.sticky-visible)
       • Scrolling DOWN → hides header (.sticky-hidden)
   - Above the first fold → header always visible (normal flow)
   - Also closes the mobile menu whenever the user scrolls
   ========================================================= */

// Capture viewport height once on load to define the "first fold" boundary
const firstFoldHeight = window.innerHeight;

// Track the previous scroll position to detect scroll direction
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  /* Add/remove shadow-shrink class at 50px threshold */
  if (currentScrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  /* Show/hide header based on scroll direction — only past the first fold */
  if (currentScrollY > firstFoldHeight) {
    if (currentScrollY < lastScrollY) {
      // User is scrolling UP → reveal header
      header.classList.add("sticky-visible");
      header.classList.remove("sticky-hidden");
    } else {
      // User is scrolling DOWN → hide header
      header.classList.add("sticky-hidden");
      header.classList.remove("sticky-visible");
    }
  } else {
    // Still within the first fold — keep header in normal document flow
    header.classList.remove("sticky-hidden");
    header.classList.remove("sticky-visible");
  }

  // Update scroll position reference for next scroll event
  lastScrollY = currentScrollY;

  /* Collapse mobile menu on any scroll */
  mobileMenu.classList.remove("active");
  menuBtn.textContent = "☰";
});


/* =========================================================
   DESKTOP DROPDOWN — PRODUCTS MENU
   - Clicking the "Products" button toggles .active on the dropdown
   - Clicking anywhere outside the dropdown closes it
   ========================================================= */

// Toggle dropdown open/closed on button click
desktopDropdown.querySelector(".dropdown-btn").addEventListener("click", () => {
  desktopDropdown.classList.toggle("active");
});

// Close dropdown when a click occurs outside of it
document.addEventListener("click", function (e) {
  if (!desktopDropdown.contains(e.target)) {
    desktopDropdown.classList.remove("active");
  }
});


/* =========================================================
   MOBILE MENU — HAMBURGER TOGGLE
   - Clicking the hamburger button (#menuBtn) toggles .active
     on the mobile menu panel
   - Icon switches between ☰ (closed) and ✖ (open)
   ========================================================= */

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  // Update icon to reflect current menu state
  menuBtn.textContent = mobileMenu.classList.contains("active") ? "✖" : "☰";
});


/* =========================================================
   MOBILE DROPDOWN — PRODUCTS SUB-MENU
   - Clicking the "Products" button in the mobile menu
     toggles .active on the mobile dropdown list
   ========================================================= */

mobileDropdownBtn.addEventListener("click", () => {
  mobileDropdown.classList.toggle("active");
});


/* =========================================================
   PRODUCT IMAGE GALLERY + ZOOM
   IIFE — self-contained to avoid polluting the global scope.

   GALLERY (carousel):
   - images[]      : ordered array of image src paths matching thumbnails
   - currentIndex  : tracks which image is currently displayed
   - goTo(index)   : switches to a given image index with a fade transition,
                     updates thumbnail .active state, and refreshes zoom source
   - Prev/Next buttons call goTo(currentIndex ± 1) with wrap-around
   - Thumbnail clicks call goTo(their data-index)

   ZOOM:
   - ZOOM_FACTOR   : how many times larger the zoomed view is (3×)
   - LENS_SIZE     : width/height of the lens box in px (120px)
   - mouseenter    : shows lens overlay and zoom preview panel
   - mouseleave    : hides lens overlay and zoom preview panel
   - mousemove     : repositions lens, calculates background-position for
                     the zoom preview inner div to show the correct zoomed area
   ========================================================= */

(function () {
  // ---- Image source array — must match the order of .thumbnail elements ----
  const images = [
    './assets/gw1.jpg',
    './assets/gw1.jpg',
    './assets/hero-fold-v2.png',
    './assets/hero-fold-v2.png',
    './assets/hero-fold-v2.png',
  ];

  let currentIndex = 0;

  // DOM references for gallery and zoom elements
  const mainImg     = document.getElementById('mainImg');
  const zoomLens    = document.getElementById('zoomLens');
  const zoomPreview = document.getElementById('zoomPreview');
  const zoomInner   = document.getElementById('zoomPreviewInner');
  const heroImgEl   = document.getElementById('mainImage');
  const thumbnails  = document.querySelectorAll('.thumbnail');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');

  // ---- CAROUSEL ----

  /**
   * goTo(index)
   * Navigates to the image at the given index (wraps around using modulo).
   * Applies a brief .fade CSS class for the transition effect,
   * swaps the src after 200ms, and syncs the active thumbnail state.
   */
  function goTo(index) {
    currentIndex = (index + images.length) % images.length;
    mainImg.classList.add('fade');
    setTimeout(() => {
      mainImg.src = images[currentIndex];
      // Sync zoom preview background immediately when the image changes
      zoomInner.style.backgroundImage = `url('${images[currentIndex]}')`;
      mainImg.classList.remove('fade');
    }, 200);
    // Sync active state on all thumbnails
    thumbnails.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
  }

  // Prev / Next button event listeners
  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Thumbnail click listeners — each navigates to its own index
  thumbnails.forEach((thumb, i) => thumb.addEventListener('click', () => goTo(i)));

  // ---- ZOOM ----

  const ZOOM_FACTOR = 3;    // Zoom preview shows image at 3× size
  const LENS_SIZE   = 120;  // Lens box dimensions in pixels (square)

  // Show lens and activate zoom preview panel on mouse enter
  heroImgEl.addEventListener('mouseenter', () => {
    zoomLens.style.opacity = '1';
    zoomPreview.classList.add('active');
  });

  // Hide lens and deactivate zoom preview panel on mouse leave
  heroImgEl.addEventListener('mouseleave', () => {
    zoomLens.style.opacity = '0';
    zoomPreview.classList.remove('active');
  });

  /**
   * mousemove handler
   * 1. Calculates cursor position relative to the main image container.
   * 2. Clamps lens position so it never goes outside the image bounds.
   * 3. Moves the lens overlay to follow the cursor.
   * 4. Calculates the corresponding background-position for the zoom
   *    preview so it shows the region under the lens at ZOOM_FACTOR×.
   */
  heroImgEl.addEventListener('mousemove', (e) => {
    const rect = heroImgEl.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const halfLens = LENS_SIZE / 2;

    // Clamp so lens stays fully within the image boundaries
    x = Math.max(halfLens, Math.min(x, rect.width  - halfLens));
    y = Math.max(halfLens, Math.min(y, rect.height - halfLens));

    // Position the lens overlay
    zoomLens.style.left = `${x - halfLens}px`;
    zoomLens.style.top  = `${y - halfLens}px`;

    // Calculate zoom preview background size (image at ZOOM_FACTOR× its rendered size)
    const previewW = zoomPreview.offsetWidth;
    const previewH = zoomPreview.offsetHeight;
    const ratioX   = (x - halfLens) / (rect.width  - LENS_SIZE);
    const ratioY   = (y - halfLens) / (rect.height - LENS_SIZE);
    const bgW      = rect.width  * ZOOM_FACTOR;
    const bgH      = rect.height * ZOOM_FACTOR;

    // Offset so the zoomed region aligns with what the lens is covering
    const bgX = ratioX * (bgW - previewW);
    const bgY = ratioY * (bgH - previewH);

    // Apply zoomed background to the preview inner element
    zoomInner.style.backgroundImage    = `url('${images[currentIndex]}')`;
    zoomInner.style.backgroundSize     = `${bgW}px ${bgH}px`;
    zoomInner.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  });
})();


/* =========================================================
   FAQ ACCORDION
   IIFE — scoped to .faq-section to prevent conflicts if other
   FAQ-style components exist elsewhere on the page.

   Behaviour:
   - Clicking a .faq-question toggles its parent .faq-item open/closed
   - Only one item can be open at a time (others collapse automatically)
   - .faq-icon text switches between "+" (closed) and "−" (open)

   faqHandleSubmit(btn):
   - Exposed on window so the inline onclick in HTML can call it
   - Reads the email input sibling, alerts the value, then clears the field
   - Returns early if the input is empty
   ========================================================= */

(function () {
  // Attach click listeners to every FAQ question inside .faq-section
  document.querySelectorAll(".faq-section .faq-question").forEach(function (question) {
    question.addEventListener("click", function () {
      var item     = question.parentElement;
      var isActive = item.classList.contains("active");

      // Collapse all FAQ items and reset their icons
      document.querySelectorAll(".faq-section .faq-item").forEach(function (i) {
        i.classList.remove("active");
        i.querySelector(".faq-icon").textContent = "+";
      });

      // If the clicked item was not already open, open it
      if (!isActive) {
        item.classList.add("active");
        item.querySelector(".faq-icon").textContent = "−";
      }
    });
  });

  /**
   * faqHandleSubmit(btn)
   * Called via onclick="faqHandleSubmit(this)" on the catalogue request button.
   * @param {HTMLElement} btn - the submit button element
   */
  window.faqHandleSubmit = function (btn) {
    var input = btn.previousElementSibling; // The email <input> directly before the button
    if (!input.value) return;               // Do nothing if the field is empty
    alert("Email submitted: " + input.value);
    input.value = "";                       // Clear the field after submission
  };
})();


/* =========================================================
   APPLICATIONS GALLERY — HORIZONTAL SCROLL
   IIFE — exposes appsScrollGallery on window for the inline
   onclick handlers on the nav arrow buttons in the HTML.

   appsScrollGallery(direction):
   - direction: -1 scrolls left, +1 scrolls right
   - Each call moves the gallery by 420px (approx one card width)
   - CSS scroll-behavior: smooth handles the animation
   ========================================================= */

(function () {
  /**
   * appsScrollGallery(direction)
   * Scrolls the #apps-gallery container left or right by one card width.
   * @param {number} direction - -1 for left, +1 for right
   */
  window.appsScrollGallery = function (direction) {
    var gallery      = document.getElementById("apps-gallery");
    var scrollAmount = 420; // Pixels per scroll step (~one card width)
    gallery.scrollLeft += direction * scrollAmount;
  };
})();


/* =========================================================
   MANUFACTURING WORKFLOW STEPPER
   IIFE — dynamically renders a step-by-step process viewer
   inside the .workflow-section of the manufacturing hero.

   DATA:
   - wfSteps[]  : labels for each step button in the stepper bar
                  (8 steps total: Raw Material → Packaging)
   - wfData[]   : content for each active step (only 3 defined;
                  steps beyond index 2 fall back to wfData[0])
                  Each entry contains: title, desc, checklist[], image, icons[]

   RENDERING:
   - On load: iterates wfSteps to create a <button class="wf-step-btn">
     for each step and appends it to #wf-stepper
   - Calls wfLoadStep(0) to display the first step on page load

   wfLoadStep(index):
   - Removes .active from all step buttons, adds it to the selected one
   - Pulls the matching wfData entry (falls back to index 0 if undefined)
   - Updates: step title, description, background image,
     checklist items (each with a checkmark icon), and icon overlays
   ========================================================= */

(function () {
  // Step labels for the stepper navigation bar (left to right)
  var wfSteps = [
    'Raw Material',
    'Extrusion',
    'Cooling',
    'Sizing',
    'Quality Control',
    'Marking',
    'Cutting',
    'Packaging'
  ];

  // Content data for each step
  // NOTE: Only 3 steps have data; steps 3–7 fall back to wfData[0]
  var wfData = [
    {
      title: 'High-Grade Raw Material Selection',
      desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness.',
      checklist: ['PE100 grade material', 'Optimal molecular weight distribution'],
      image: './assets/gw1.jpg',
      // icons: [] — no icon overlays for this step
    },
    {
      title: 'Precision Extrusion Process',
      desc: 'Advanced extrusion technology ensures consistent wall thickness.',
      checklist: ['Temperature controlled extrusion', 'Consistent material flow'],
      image: './assets/gw1.jpg',
      // icons: [] — no icon overlays for this step
    },
    {
      title: 'Controlled Cooling System',
      desc: 'Gradual cooling maintains structural integrity.',
      checklist: ['Gradual temperature reduction', 'Stress prevention technology'],
      image: './assets/gw1.jpg',
      // icons: [] — no icon overlays for this step
    }
  ];

  // DOM references for the workflow section elements
  var stepper     = document.getElementById('wf-stepper');
  var titleEl     = document.getElementById('wf-title');
  var descEl      = document.getElementById('wf-desc');
  var checklistEl = document.getElementById('wf-checklist');
  var bgImageEl   = document.getElementById('wf-bg-image');
  var iconsEl     = document.getElementById('wf-icons');

  /**
   * wfLoadStep(index)
   * Updates the workflow content panel to display the selected step.
   * Falls back to wfData[0] if no data exists for the given index.
   * @param {number} index - zero-based step index
   */
  function wfLoadStep(index) {
    // Deactivate all step buttons then activate the selected one
    document.querySelectorAll('.workflow-section .wf-step-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    document.querySelectorAll('.workflow-section .wf-step-btn')[index].classList.add('active');

    // Resolve data — fall back to first entry if step has no data defined
    var item = wfData[index] || wfData[0];

    // Update text content
    titleEl.textContent = item.title;
    descEl.textContent  = item.desc;
    bgImageEl.src       = item.image;

    // Rebuild checklist — each item gets a checkmark icon + label span
    checklistEl.innerHTML = '';
    item.checklist.forEach(function (text) {
      var div       = document.createElement('div');
      div.className = 'wf-check-item';
      div.innerHTML = '<img src="./assets/gw22.svg" alt=""><span>' + text + '</span>';
      checklistEl.appendChild(div);
    });

    // Rebuild icon overlays (empty for all current steps)
    iconsEl.innerHTML = '';
    (item.icons || []).forEach(function (icon) {
      var img = document.createElement('img');
      img.src = icon;
      iconsEl.appendChild(img);
    });
  }

  // Build step buttons dynamically from wfSteps array and append to stepper bar
  wfSteps.forEach(function (step, i) {
    var btn       = document.createElement('button');
    btn.textContent = step;
    btn.className   = 'wf-step-btn';
    btn.onclick     = function () { wfLoadStep(i); }; // Each button loads its own step
    stepper.appendChild(btn);
  });

  // Load the first step on page load
  wfLoadStep(0);
})();
