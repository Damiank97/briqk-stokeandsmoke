const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const desktopEffects = finePointer && !reduceMotion && window.innerWidth > 980;
const root = document.documentElement;

const emberField = document.getElementById("ember-field");
if (emberField && !reduceMotion) {
  const emberCount = window.innerWidth < 700 ? 18 : 36;
  const colors = ["#ee8a0a", "#ffb43f", "#ff6a00", "#ffd07a"];

  for (let index = 0; index < emberCount; index += 1) {
    const ember = document.createElement("i");
    ember.className = "ember";
    ember.style.left = `${4 + Math.random() * 88}%`;
    ember.style.setProperty("--size", `${1.5 + Math.random() * 3.2}px`);
    ember.style.setProperty("--duration", `${5.5 + Math.random() * 8}s`);
    ember.style.setProperty("--delay", `${-Math.random() * 10}s`);
    ember.style.setProperty("--rise", `${-(180 + Math.random() * 520)}px`);
    ember.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    ember.style.setProperty("--opacity", `${0.35 + Math.random() * 0.62}`);
    ember.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
    emberField.appendChild(ember);
  }
}

document.querySelectorAll("[data-burn]").forEach((line, lineIndex) => {
  if (reduceMotion) return;
  const text = line.textContent.trim();
  line.textContent = "";
  line.setAttribute("aria-hidden", "true");

  [...text].forEach((character, characterIndex) => {
    const span = document.createElement("span");
    span.className = "burn-char";
    span.textContent = character === " " ? "\u00a0" : character;
    span.style.setProperty("--char-delay", `${0.18 + lineIndex * 0.28 + characterIndex * 0.035}s`);
    line.appendChild(span);
  });
});

if (desktopEffects) {
  root.classList.add("has-custom-cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let lastTrail = 0;

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animateCursor);
  }

  document.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    root.classList.toggle("cursor-hover", Boolean(event.target.closest?.("a, button, summary")));
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    const now = performance.now();
    if (now - lastTrail > 46) {
      lastTrail = now;
      const trail = document.createElement("i");
      trail.className = "cursor-ember";
      trail.style.left = `${mouseX}px`;
      trail.style.top = `${mouseY}px`;
      trail.style.setProperty("--trail-x", `${-8 + Math.random() * 16}px`);
      trail.style.setProperty("--trail-y", `${12 + Math.random() * 22}px`);
      document.body.appendChild(trail);
      trail.addEventListener("animationend", () => trail.remove(), { once: true });
    }
  }, { passive: true });

  document.addEventListener("pointerover", (event) => {
    root.classList.toggle("cursor-hover", Boolean(event.target.closest("a, button, summary")));
  });

  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget?.closest?.("a, button, summary")) {
      root.classList.remove("cursor-hover");
    }
  });

  animateCursor();
}

document.querySelectorAll("[data-magnetic]").forEach((element) => {
  if (!desktopEffects) return;
  element.addEventListener("pointermove", (event) => {
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.18;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.18;
    element.style.setProperty("--magnetic-x", `${x}px`);
    element.style.setProperty("--magnetic-y", `${y}px`);
  });
  element.addEventListener("pointerleave", () => {
    element.style.setProperty("--magnetic-x", "0px");
    element.style.setProperty("--magnetic-y", "0px");
  });
});

const hero = document.querySelector(".hero");
const heroMedia = document.querySelector(".hero-media");
if (hero && heroMedia && desktopEffects) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    hero.style.setProperty("--mouse-x", `${relativeX * 100}%`);
    hero.style.setProperty("--mouse-y", `${relativeY * 100}%`);
    heroMedia.style.setProperty("--parallax-x", `${(relativeX - 0.5) * -12}px`);
    heroMedia.style.setProperty("--parallax-y", `${(relativeY - 0.5) * -9}px`);
  }, { passive: true });

  hero.addEventListener("pointerleave", () => {
    heroMedia.style.setProperty("--parallax-x", "0px");
    heroMedia.style.setProperty("--parallax-y", "0px");
  });
}

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-nav");
const menuLabel = menuButton?.querySelector(".sr-only");

function setMenu(open) {
  if (!menuButton || !siteMenu) return;
  menuButton.setAttribute("aria-expanded", String(open));
  siteMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  if (menuLabel) menuLabel.textContent = open ? "Menu sluiten" : "Menu openen";
}

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

siteMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) setMenu(false);
});

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reveals = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contact-form");
const whatsappButton = document.getElementById("whatsapp-submit");
const contactSection = document.getElementById("offerte");
const mobileContact = document.querySelector(".mobile-contact");

if (hero && contactSection && mobileContact) {
  let heroPassed = hero.getBoundingClientRect().bottom <= 0;
  let contactInView = false;

  const updateMobileContact = () => {
    const shouldShow = heroPassed && !contactInView;
    mobileContact.classList.toggle("is-visible", shouldShow);
    mobileContact.setAttribute("aria-hidden", String(!shouldShow));
  };

  if ("IntersectionObserver" in window) {
    const mobileContactObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) {
          heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        }

        if (entry.target === contactSection) {
          contactInView = entry.isIntersecting;
        }
      });

      updateMobileContact();
    }, { threshold: 0 });

    mobileContactObserver.observe(hero);
    mobileContactObserver.observe(contactSection);
  } else {
    const checkMobileContact = () => {
      const heroBounds = hero.getBoundingClientRect();
      const contactBounds = contactSection.getBoundingClientRect();
      heroPassed = heroBounds.bottom <= 0;
      contactInView = contactBounds.top < window.innerHeight && contactBounds.bottom > 0;
      updateMobileContact();
    };

    checkMobileContact();
    window.addEventListener("scroll", checkMobileContact, { passive: true });
    window.addEventListener("resize", checkMobileContact, { passive: true });
  }

  updateMobileContact();
}

function validateForm() {
  if (!form) return false;
  const requiredFields = form.querySelectorAll("[required]");
  requiredFields.forEach((field) => {
    field.classList.toggle("is-invalid", !field.validity.valid);
  });
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

form?.addEventListener("input", (event) => {
  if (event.target.matches("[required]")) {
    event.target.classList.toggle("is-invalid", !event.target.validity.valid);
  }
});

function requestText() {
  const values = Object.fromEntries(new FormData(form).entries());
  const datum = values.datum
    ? new Intl.DateTimeFormat("nl-NL", { dateStyle: "long" }).format(new Date(`${values.datum}T12:00:00`))
    : "Nog niet bekend";

  return [
    "Hoi Everhard, ik wil graag de mogelijkheden voor BBQ catering bespreken.",
    "",
    `Naam: ${values.naam}`,
    `E-mail: ${values.email}`,
    `Datum: ${datum}`,
    `Aantal gasten: ${values.gasten || "Nog niet bekend"}`,
    `Type event: ${values.type || "Nog niet gekozen"}`,
    "",
    "Mijn plannen:",
    values.bericht || "Ik vertel je graag meer in een gesprek."
  ].join("\n");
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;
  const subject = "Aanvraag BBQ catering";
  window.location.href = `mailto:grillmaster@stokeandsmoke.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestText())}`;
});

whatsappButton?.addEventListener("click", () => {
  if (!validateForm()) return;
  const url = `https://wa.me/31637386098?text=${encodeURIComponent(requestText())}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
