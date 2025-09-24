/* ==============================
   PORTFOLIO VANILLA JS
============================== */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ----------- HEADER + NAV ----------- */
const header = $("#header");
const navToggle = $(".nav__toggle");
const nav = $(".nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("nav--open");
  navToggle.setAttribute("aria-expanded", open);
});

/* close nav after click link (mobile) */
$$(".nav__link").forEach((link) =>
  link.addEventListener("click", () => nav.classList.remove("nav--open"))
);

/* slightly transparent header on scroll */
let last = 0;
window.addEventListener("scroll", () => {
  const current = window.scrollY;
  header.style.background =
    current > 40 ? "rgba(11, 15, 20, .95)" : "rgba(11, 15, 20, .85)";
  last = current;
});

/* ----------- SCROLL REVEAL ----------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
      }
    });
  },
  { threshold: 0.15 }
);

$$(".section").forEach((sec) => {
  sec.classList.add("reveal");
  observer.observe(sec);
});

/* ----------- PROJECT MODAL ----------- */
const modal = $("#projectModal");
const modalBody = $("#modalBody");
const projectCards = $$(".project-card");

const projectData = {
  1: {
    title: "Neon Todo",
    img: "assets/proj1.webp",
    desc: "A minimal todo application with persistent dark-mode and neon accents. Users can add, edit, delete and filter tasks. All data is stored in localStorage for offline usage.",
    tech: ["React", "Tailwind CSS", "localStorage"],
    demo: "#",
    repo: "https://github.com",
  },
  2: {
    title: "Spotify UI Clone",
    img: "assets/proj2.webp",
    desc: "Pixel-perfect responsive clone of Spotify desktop web player. Focus on UI only, no playback logic. Includes smooth sidebar animations and playlist cards.",
    tech: ["Vue 3", "SCSS", "GSAP"],
    demo: "#",
    repo: "https://github.com",
  },
  3: {
    title: "Weather Dash",
    img: "assets/proj3.webp",
    desc: "Real-time weather dashboard using OpenWeather API. Displays current conditions, 5-day forecast and interactive charts using Chart.js.",
    tech: ["Vanilla JS", "Chart.js", "Geolocation API"],
    demo: "#",
    repo: "https://github.com",
  },
};

function openModal(id) {
  const p = projectData[id];
  modalBody.innerHTML = `
    <img src="${p.img}" alt="${p.title}" loading="lazy">
    <h2>${p.title}</h2>
    <p>${p.desc}</p>
    <div class="project-card__tech">${p.tech
      .map((t) => `<span>${t}</span>`)
      .join("")}</div>
    <div style="margin-top:1.5rem;display:flex;gap:1rem;">
      <a href="${
        p.demo
      }" class="btn" target="_blank" rel="noopener">Live Demo</a>
      <a href="${
        p.repo
      }" class="btn btn--outline" target="_blank" rel="noopener">GitHub</a>
    </div>
  `;
  modal.hidden = false;
  trapFocus(modal);
}

function closeModal() {
  modal.hidden = true;
  projectCards.find((c) => c.dataset.id === modal.dataset.active)?.focus();
}

projectCards.forEach((card) => {
  card.querySelector(".project-card__btn").addEventListener("click", () => {
    openModal(card.dataset.id);
    modal.dataset.active = card.dataset.id;
  });
});

$(".modal__close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

/* focus trap inside modal */
function trapFocus(el) {
  const focusable = $$(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    el
  );
  const first = focusable[0];
  const last = focusable.at(-1);
  first?.focus();
  el.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
    if (e.key === "Escape") closeModal();
  });
}

/* ----------- CONTACT FORM ----------- */
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  let ok = true;

  /* simple validation */
  $$(".form__error").forEach((msg) => (msg.textContent = ""));
  if (data.name.trim().length < 2) {
    $("#name").nextElementSibling.textContent = "Name too short";
    ok = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    $("#email").nextElementSibling.textContent = "Invalid email";
    ok = false;
  }
  if (data.message.trim().length < 10) {
    $("#message").nextElementSibling.textContent = "Message too short";
    ok = false;
  }

  if (!ok) return;

  /* fake send */
  alert("Thank you! Your message has been sent (demo only).");
  form.reset();
});

/* ----------- YEAR IN FOOTER ----------- */
$("#year").textContent = new Date().getFullYear();
