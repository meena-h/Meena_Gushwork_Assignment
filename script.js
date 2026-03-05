const header = document.getElementById("header");
const desktopDropdown = document.getElementById("desktopDropdown");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileDropdownBtn = document.getElementById("mobileDropdownBtn");
const mobileDropdown = document.getElementById("mobileDropdown");

/* ================= STICKY SCROLL EFFECT ================= */

// Get the height of the first fold (viewport height)
const firstFoldHeight = window.innerHeight;

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  /* Scrolled class for shadow/shrink effect */
  if (currentScrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  /* Show/hide header based on scroll direction & position past first fold */
  if (currentScrollY > firstFoldHeight) {
    if (currentScrollY < lastScrollY) {
      // Scrolling UP past first fold → show header
      header.classList.add("sticky-visible");
      header.classList.remove("sticky-hidden");
    } else {
      // Scrolling DOWN past first fold → hide header
      header.classList.add("sticky-hidden");
      header.classList.remove("sticky-visible");
    }
  } else {
    // Above first fold → always visible (normal flow)
    header.classList.remove("sticky-hidden");
    header.classList.remove("sticky-visible");
  }

  lastScrollY = currentScrollY;

  /* Close mobile menu on scroll */
  mobileMenu.classList.remove("active");
  menuBtn.textContent = "☰";
});

/* ================= DESKTOP DROPDOWN ================= */

desktopDropdown.querySelector(".dropdown-btn").addEventListener("click", () => {
  desktopDropdown.classList.toggle("active");
});

document.addEventListener("click", function (e) {
  if (!desktopDropdown.contains(e.target)) {
    desktopDropdown.classList.remove("active");
  }
});

/* ================= MOBILE MENU ================= */

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  menuBtn.textContent = mobileMenu.classList.contains("active") ? "✖" : "☰";
});

/* ================= MOBILE DROPDOWN ================= */

mobileDropdownBtn.addEventListener("click", () => {
  mobileDropdown.classList.toggle("active");
});

 (function () {
  // ---- DATA: match these to your actual thumbnail srcs ----
  const images = [
    './assets/gw1.jpg',
    './assets/gw1.jpg',
    './assets/hero-fold-v2.png',
    './assets/hero-fold-v2.png',
    './assets/hero-fold-v2.png',
  ];

  let currentIndex = 0;

  const mainImg     = document.getElementById('mainImg');
  const zoomLens    = document.getElementById('zoomLens');
  const zoomPreview = document.getElementById('zoomPreview');
  const zoomInner   = document.getElementById('zoomPreviewInner');
  const heroImgEl   = document.getElementById('mainImage');
  const thumbnails  = document.querySelectorAll('.thumbnail');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');

  // ---- CAROUSEL ----
  function goTo(index) {
    currentIndex = (index + images.length) % images.length;
    mainImg.classList.add('fade');
    setTimeout(() => {
      mainImg.src = images[currentIndex];
      // Update zoom source immediately when image changes
      zoomInner.style.backgroundImage = `url('${images[currentIndex]}')`;
      mainImg.classList.remove('fade');
    }, 200);
    thumbnails.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
  thumbnails.forEach((thumb, i) => thumb.addEventListener('click', () => goTo(i)));

  // ---- ZOOM ----
  const ZOOM_FACTOR = 3;
  const LENS_SIZE   = 120;

  heroImgEl.addEventListener('mouseenter', () => {
    zoomLens.style.opacity = '1';
    zoomPreview.classList.add('active');
  });

  heroImgEl.addEventListener('mouseleave', () => {
    zoomLens.style.opacity = '0';
    zoomPreview.classList.remove('active');
  });

  heroImgEl.addEventListener('mousemove', (e) => {
    const rect = heroImgEl.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const halfLens = LENS_SIZE / 2;
    x = Math.max(halfLens, Math.min(x, rect.width  - halfLens));
    y = Math.max(halfLens, Math.min(y, rect.height - halfLens));

    zoomLens.style.left = `${x - halfLens}px`;
    zoomLens.style.top  = `${y - halfLens}px`;

    const previewW = zoomPreview.offsetWidth;
    const previewH = zoomPreview.offsetHeight;
    const ratioX = (x - halfLens) / (rect.width  - LENS_SIZE);
    const ratioY = (y - halfLens) / (rect.height - LENS_SIZE);
    const bgW = rect.width  * ZOOM_FACTOR;
    const bgH = rect.height * ZOOM_FACTOR;
    const bgX = ratioX * (bgW - previewW);
    const bgY = ratioY * (bgH - previewH);

    zoomInner.style.backgroundImage    = `url('${images[currentIndex]}')`;
    zoomInner.style.backgroundSize     = `${bgW}px ${bgH}px`;
    zoomInner.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  });
})();

(function () {
  // Scoped FAQ toggle — only targets .faq-section items
  document.querySelectorAll(".faq-section .faq-question").forEach(function (question) {
    question.addEventListener("click", function () {
      var item = question.parentElement;
      var isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-section .faq-item").forEach(function (i) {
        i.classList.remove("active");
        i.querySelector(".faq-icon").textContent = "+";
      });

      if (!isActive) {
        item.classList.add("active");
        item.querySelector(".faq-icon").textContent = "−";
      }
    });
  });

  window.faqHandleSubmit = function (btn) {
    var input = btn.previousElementSibling;
    if (!input.value) return;
    alert("Email submitted: " + input.value);
    input.value = "";
  };
})();

(function () {
  window.appsScrollGallery = function (direction) {
    var gallery = document.getElementById("apps-gallery");
    var scrollAmount = 420;
    gallery.scrollLeft += direction * scrollAmount;
  };
})();
(function () {
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

  var wfData = [
    {
      title: 'High-Grade Raw Material Selection',
      desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness.',
      checklist: ['PE100 grade material', 'Optimal molecular weight distribution'],
      image: './assets/gw1.jpg',
     
    },
    {
      title: 'Precision Extrusion Process',
      desc: 'Advanced extrusion technology ensures consistent wall thickness.',
      checklist: ['Temperature controlled extrusion', 'Consistent material flow'],
      image: './assets/gw1.jpg',
      
    },
    {
      title: 'Controlled Cooling System',
      desc: 'Gradual cooling maintains structural integrity.',
      checklist: ['Gradual temperature reduction', 'Stress prevention technology'],
      image: './assets/gw1.jpg',
     
    }
  ];

  var stepper    = document.getElementById('wf-stepper');
  var titleEl    = document.getElementById('wf-title');
  var descEl     = document.getElementById('wf-desc');
  var checklistEl = document.getElementById('wf-checklist');
  var bgImageEl  = document.getElementById('wf-bg-image');
  var iconsEl    = document.getElementById('wf-icons');

  function wfLoadStep(index) {
    document.querySelectorAll('.workflow-section .wf-step-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    document.querySelectorAll('.workflow-section .wf-step-btn')[index].classList.add('active');

    var item = wfData[index] || wfData[0];

    titleEl.textContent = item.title;
    descEl.textContent  = item.desc;
    bgImageEl.src       = item.image;

    checklistEl.innerHTML = '';
    item.checklist.forEach(function (text) {
      var div = document.createElement('div');
      div.className = 'wf-check-item';
      div.innerHTML = '<img src="./assets/gw22.svg" alt=""><span>' + text + '</span>';
      checklistEl.appendChild(div);
    });

    iconsEl.innerHTML = '';
(item.icons || []).forEach(function (icon) {
      var img = document.createElement('img');
      img.src = icon;
      iconsEl.appendChild(img);
    });
  }

  wfSteps.forEach(function (step, i) {
    var btn = document.createElement('button');
    btn.textContent = step;
    btn.className   = 'wf-step-btn';
    btn.onclick     = function () { wfLoadStep(i); };
    stepper.appendChild(btn);
  });

  wfLoadStep(0);
})();


