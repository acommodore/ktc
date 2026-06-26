// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-links a');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Sticky Navigation styling on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
    navbar.style.background = 'rgba(255, 255, 255, 0.85)';
  }
});

// Intersection Observer for Scroll Animations
const observeElements = (selector) => {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: Stop observing once visible if you only want it to animate once
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Slightly before it hits bottom of viewport
  });

  elements.forEach(el => observer.observe(el));
};

// Initialize observers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  observeElements('.fade-in-up');
  observeElements('.slide-in-left');
  observeElements('.slide-in-right');
});
