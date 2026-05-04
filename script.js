/**
 * InAmigos Foundation - Main JavaScript
 * Handles interactive elements, animations, scroll observers, and slideshows.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. HERO SLIDESHOW & PARALLAX
  const home = document.getElementById("home");
  let triggerHeroTextAnim = () => {}; // Will be assigned later

  if (home) {
    const slides = document.querySelectorAll(".hero-slide");
    const indicatorContainer = document.getElementById("heroIndicators");

    if (slides.length > 1) {
      const dots = [];
      slides.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = "hero-dot" + (index === 0 ? " active" : "");
        dot.addEventListener("click", () => {
          goToSlide(index);
          resetInterval();
        });
        if (indicatorContainer) indicatorContainer.appendChild(dot);
        dots.push(dot);
      });

      let currentSlide = 0;
      let slideInterval = setInterval(nextSlide, 6000);

      function goToSlide(index) {
        slides[currentSlide].classList.remove("active");
        if (dots[currentSlide]) dots[currentSlide].classList.remove("active");
        currentSlide = index;
        slides[currentSlide].classList.add("active");
        if (dots[currentSlide]) dots[currentSlide].classList.add("active");

        // Trigger text animation for new active slide
        triggerHeroTextAnim(currentSlide);
      }

      function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
      }

      function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
      }

      // PARALLAX HERO
      window.addEventListener("scroll", () => {
        const offset = window.scrollY * 0.4;
        slides.forEach((slide) => {
          const bg = slide.querySelector(".hero-bg");
          if (bg) bg.style.backgroundPositionY = `${offset}px`;
        });
      });
    }
  }

  // 2. SCROLL COUNTER
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetStr = entry.target.getAttribute("data-target");
          const target = parseInt(targetStr, 10);
          if (isNaN(target)) return;

          const duration = 2000;
          let startTimestamp = null;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
              (timestamp - startTimestamp) / duration,
              1,
            );
            // easeOutQuad easing
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * target);

            let displayStr = currentCount.toLocaleString();
            if (progress === 1 && (target === 50000 || target === 30000)) {
              displayStr = target.toLocaleString() + "+";
            }

            entry.target.innerText = displayStr;

            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // 3. SCROLL ANIMATIONS
  const animateElements = document.querySelectorAll(".animate-on-scroll");
  const scrollObserver = new IntersectionObserver(
    (entries, observer) => {
      let staggerDelay = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, staggerDelay);
          staggerDelay += 100; // Stagger children dynamically
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  animateElements.forEach((el) => scrollObserver.observe(el));

  // 4. STICKY NAV
  const mainNav = document.getElementById("navbar");
  if (mainNav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        mainNav.classList.add("scrolled");
      } else {
        mainNav.classList.remove("scrolled");
      }
    });
  }

  // 6. DONATION SELECTOR
  const amountBtns = document.querySelectorAll(".amount-btn");
  const customInput = document.querySelector('input[type="number"]');

  amountBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      amountBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.textContent.trim().toLowerCase() === "custom") {
        if (customInput) customInput.classList.add("show");
      } else {
        if (customInput) customInput.classList.remove("show");
      }
    });
  });

  const donateBtns = document.querySelectorAll("button, a.button, .btn");
  donateBtns.forEach((btn) => {
    if (btn.textContent.toLowerCase().includes("donate now")) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "https://rzp.io/l/kWQ87HP";
      });
    }
  });

  // 7. HAMBURGER MENU
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("active");
    });
  }

  // 10. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        // Close mobile menu if open
        if (hamburger && hamburger.classList.contains("open")) {
          hamburger.click();
        }

        const navHeight = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 11. TEXT REVEAL ANIMATIONS (Heart Theme)
  function setupTextAnimations() {
    // Hero Heading Character Split for ALL slides
    const heroHeadings = document.querySelectorAll(".hero-slide h1");

    heroHeadings.forEach((heading) => {
      const text = heading.textContent;
      heading.innerHTML = "";
      const words = text.split(" ");
      let charIndex = 0;

      words.forEach((word, wIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";

        for (let i = 0; i < word.length; i++) {
          const charSpan = document.createElement("span");
          charSpan.className = "split-char";
          charSpan.textContent = word[i];
          // Data attribute to store delay
          charSpan.dataset.delay = `${charIndex * 0.03}s`;
          wordSpan.appendChild(charSpan);
          charIndex++;
        }

        if (wIndex < words.length - 1) {
          const spaceSpan = document.createElement("span");
          spaceSpan.innerHTML = "&nbsp;";
          wordSpan.appendChild(spaceSpan);
        }
        heading.appendChild(wordSpan);
      });
    });

    // Expose function to trigger animation
    triggerHeroTextAnim = (slideIndex) => {
      // Reset all
      document.querySelectorAll(".hero-slide .split-char").forEach((char) => {
        char.style.opacity = "0";
        char.style.transform = "translateY(30px)";
        char.style.transitionDelay = "0s";
      });

      // Animate current
      setTimeout(() => {
        const slides = document.querySelectorAll(".hero-slide");
        if (slides[slideIndex]) {
          const chars = slides[slideIndex].querySelectorAll(".split-char");
          chars.forEach((char) => {
            char.style.transitionDelay = char.dataset.delay;
            char.style.opacity = "1";
            char.style.transform = "translateY(0)";
          });
        }
      }, 100);
    };

    // Initial trigger
    triggerHeroTextAnim(0);

    // Section Titles Reveal by Word
    const sectionTitles = document.querySelectorAll(".section-title");
    sectionTitles.forEach((title) => {
      const text = title.textContent;
      title.innerHTML = "";
      const words = text.split(" ");

      words.forEach((word, index) => {
        const wordContainer = document.createElement("span");
        wordContainer.className = "reveal-word";

        const wordInner = document.createElement("span");
        wordInner.className = "reveal-word-inner";
        wordInner.style.transitionDelay = `${index * 0.05}s`;
        wordInner.textContent =
          word + (index < words.length - 1 ? "\u00A0" : "");

        wordContainer.appendChild(wordInner);
        title.appendChild(wordContainer);
      });

      const titleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const words = entry.target.querySelectorAll(".reveal-word");
              words.forEach((w) => w.classList.add("visible"));
              titleObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      titleObserver.observe(title);
    });
  }

  setupTextAnimations();
});
