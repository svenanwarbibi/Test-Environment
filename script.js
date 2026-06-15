// Highlight active sidebar link on scroll
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".sidebar a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const id = entry.target.id;
        const active = document.querySelector(`.sidebar a[href="#${id}"]`);
        if (active) active.classList.add("active");
      }
    });
  },
  { rootMargin: "-20% 0px -70% 0px" }
);

sections.forEach((s) => observer.observe(s));
