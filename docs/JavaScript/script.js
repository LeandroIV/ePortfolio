document.addEventListener('DOMContentLoaded', function () {
  const homeLink = document.querySelector('a[href="#home"]');
  const sections = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.sidebar nav ul li a');

  // Ensure home link is active by default
  navLinks.forEach(link => link.classList.remove('active'));
  if (homeLink) homeLink.classList.add('active');

  // Function to update active link based on scroll position
  function updateActiveLink() {
    let closestSection = null;
    let smallestDistance = Infinity;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const distanceFromTop = Math.abs(rect.top);

      if (distanceFromTop < smallestDistance) {
        smallestDistance = distanceFromTop;
        closestSection = section;
      }
    });

    const currentSectionId = closestSection ? closestSection.getAttribute('id') : 'home';

    // Remove active class from all links
    navLinks.forEach(link => {
      link.classList.remove('active');
      // Add active class to the correct link
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    // Update the URL hash without causing scrolling
    if (window.location.hash !== `#${currentSectionId}`) {
      history.replaceState(null, null, `#${currentSectionId}`);
    }
  }

  // Scroll detection for active link
  window.addEventListener('scroll', updateActiveLink);

  // Scroll to section when sidebar link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Update active link manually
        navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');

        // Update the URL hash
        history.replaceState(null, null, `#${targetId}`);
      }
    });
  });

  // Smooth scrolling on mouse wheel
  let isScrolling = false;
  window.addEventListener('wheel', function (e) {
    if (isScrolling) return;
    isScrolling = true;

    const currentSection = [...sections].find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    });

    if (currentSection) {
      let nextSection;
      if (e.deltaY > 0) {
        nextSection = currentSection.nextElementSibling;
      } else {
        nextSection = currentSection.previousElementSibling;
      }

      if (nextSection && nextSection.classList.contains('page')) {
        nextSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        setTimeout(updateActiveLink, 300);
      }
    }

    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  });

  // Ensure the page loads at the home section if needed
  function ensureHomeVisible() {
    const homeSection = document.getElementById('home');
    if (homeSection) {
      const rect = homeSection.getBoundingClientRect();
      if (rect.top >= window.innerHeight || rect.bottom <= 0) {
        homeSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }

  // Initial checks
  ensureHomeVisible();
  setTimeout(updateActiveLink, 100);

  // Toast and clipboard functions remain unchanged
  function showToast(message, ctaLink = '') {
    const toast = document.createElement('div');
    toast.className = 'toast';

    toast.innerHTML = `
      <i class="fas fa-check-circle"></i>
      ${message}
      ${ctaLink ? `<a href="${ctaLink}" class="cta-save" target="_blank">Save Contact</a>` : ''}
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function copyToClipboard(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    showToast(`Copied to clipboard: ${text}`);
  }
  window.copyToClipboard = copyToClipboard;
});

$(document).ready(function () {
  // Typing animation function
  (function ($) {
    $.fn.writeText = function (content, speed) {
      var contentArray = content.split(""),
          current = 0,
          elem = this;

      function type() {
        if (current < contentArray.length) {
          elem.text(elem.text() + contentArray[current++]);
          requestAnimationFrame(function() {
            setTimeout(type, speed); // Control speed with setTimeout inside the animation frame
          });
        }
      }

      // Start the typing effect
      type();
    };
  })(jQuery);

  // Input text for typing animation with smoother transition
  $("#holder").writeText("LGIV", 60); // Adjust speed for smoother animation (lower = faster)
});

const skillElements = document.querySelectorAll('.skill-level');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const skillLevel = entry.target;
    const skillWidth = skillLevel.getAttribute('data-skill');

    if (entry.isIntersecting) {
      // Reset the width to 0% and remove the animation class
      skillLevel.style.width = '0%';
      skillLevel.classList.remove('animate');

      // Force reflow to reset the animation state
      void skillLevel.offsetWidth;

      // After resetting, apply the new width and start the animation with a small delay
      setTimeout(() => {
        skillLevel.style.width = `${skillWidth}%`; // Set the width based on the data-skill attribute
        skillLevel.classList.add('animate'); // Re-add the animation class
      }, 100); // Small delay ensures smooth re-triggering
    }
  });
}, { threshold: 0.5 }); // Trigger when at least 50% of the element is in view

// Observe each skill level bar
skillElements.forEach((skillLevel) => {
  observer.observe(skillLevel);
});

// Smooth scroll behavior for sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// Smooth scrolling for wheel events (on desktop)
let isScrolling = false;
window.addEventListener('wheel', function (e) {
  if (isScrolling) return;
  isScrolling = true;

  const currentSection = [...document.querySelectorAll('.page')].find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
  });

  if (currentSection) {
    let nextSection;
    if (e.deltaY > 0) {
      nextSection = currentSection.nextElementSibling;
    } else {
      nextSection = currentSection.previousElementSibling;
    }

    if (nextSection && nextSection.classList.contains('page')) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      setTimeout(() => {
        isScrolling = false;
      }, 500); // Timeout to allow smooth scrolling completion
    }
  }

  setTimeout(() => {
    isScrolling = false;
  }, 500); // Timeout for debouncing scroll events
});

const prevButton = document.querySelector('.slider--btn__prev');
const nextButton = document.querySelector('.slider--btn__next');
const slides = document.querySelectorAll('.slide');
const slidesWrapper = document.querySelector('.slides');
let currentIndex = 0;

// Function to update the current slide position
function updateSlidePosition() {
  const slideWidth = slides[0].offsetWidth;
  slidesWrapper.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
}

// Function to handle next button click
nextButton.addEventListener('click', function () {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // Wrap around to the first slide
  }
  updateSlidePosition();
});

// Function to handle previous button click
prevButton.addEventListener('click', function () {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = slides.length - 1; // Wrap around to the last slide
  }
  updateSlidePosition();
});

// Initialize the slider position on page load
updateSlidePosition();


// Toggle Menu Function
function toggleMenu() {
  const header = document.querySelector('.header');
  header.classList.toggle('open');
}
