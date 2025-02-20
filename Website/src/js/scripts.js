// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Add animation on scroll for feature cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
});

document.querySelectorAll(".feature-card").forEach((card) => {
  card.style.opacity = 0;
  card.style.transform = "translateY(20px)";
  card.style.transition = "all 0.6s ease-out";
  observer.observe(card);
});

// Add hover effect to buttons
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseover", () => {
    btn.style.transform = "translateY(-2px)";
  });
  btn.addEventListener("mouseout", () => {
    btn.style.transform = "translateY(0)";
  });
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".navbar")) {
    navLinks.classList.remove("active");
  }
});

// Add this code to handle logged-in state
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if (isLoggedIn) {
  document.querySelectorAll(".logged-in").forEach((element) => {
    element.style.display = "inline-block";
  });
}
