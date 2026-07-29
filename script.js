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

if (contactSection && mobileContact && "IntersectionObserver" in window) {
  const contactObserver = new IntersectionObserver(([entry]) => {
    mobileContact.classList.toggle("is-hidden", entry.isIntersecting);
  }, { threshold: 0.08 });
  contactObserver.observe(contactSection);
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
