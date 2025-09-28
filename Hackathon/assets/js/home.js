// Hamburger toggle for mobile nav
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  // Animate hamburger
  hamburger.classList.toggle("toggle");
});
