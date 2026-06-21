import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  onValue,
  ref,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqAq7PgbKgXa5aDSetuRuqSNNy0LFp2RI",
  authDomain: "portfolio-rating-489af.firebaseapp.com",
  databaseURL: "https://portfolio-rating-489af-default-rtdb.firebaseio.com/",
  projectId: "portfolio-rating-489af",
  storageBucket: "portfolio-rating-489af.firebasestorage.app",
  messagingSenderId: "531742910389",
  appId: "1:531742910389:web:2eafab8e5644ddfd36dbfc",
  measurementId: "G-83GNMWVLYW",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setupIntro() {
  const intro = document.getElementById("cinematicIntro");

  if (reduceMotion) {
    document.body.classList.remove("intro-playing");
    intro?.remove();
    return;
  }

  window.setTimeout(() => {
    document.body.classList.remove("intro-playing");
    intro?.remove();
  }, 2600);
}

function setupMobileMenu() {
  const menuButton = document.getElementById("menuBtn");
  const navigationLinks = document.getElementById("navLinks");

  if (!menuButton || !navigationLinks) return;

  const setMenuOpen = (isOpen) => {
    navigationLinks.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(!navigationLinks.classList.contains("open"));
  });

  navigationLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!navigationLinks.classList.contains("open")) return;
    if (navigationLinks.contains(event.target) || menuButton.contains(event.target)) return;
    setMenuOpen(false);
  });
}

function setupNavigation() {
  const navigation = document.querySelector(".nav");
  const linksContainer = document.querySelector(".nav-links");
  const glider = document.getElementById("navGlider");
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));
  const sections = document.querySelectorAll("header[id], main section[id]");
  let activeLink = null;

  if (!navigation) return;

  const updateScrollState = () => {
    navigation.classList.toggle("scrolled", window.scrollY > 40);
  };

  const moveGlider = (link) => {
    if (!link || !glider || !linksContainer || window.innerWidth <= 900) return;

    const linkRect = link.getBoundingClientRect();
    const containerRect = linksContainer.getBoundingClientRect();

    glider.style.setProperty("--glider-left", `${linkRect.left - containerRect.left}px`);
    glider.style.setProperty("--glider-width", `${linkRect.width}px`);
    glider.style.setProperty("--glider-opacity", "1");
  };

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => moveGlider(link));
    link.addEventListener("focus", () => moveGlider(link));
  });

  linksContainer?.addEventListener("mouseleave", () => {
    if (activeLink) {
      moveGlider(activeLink);
    } else if (glider) {
      glider.style.setProperty("--glider-opacity", "0");
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const sectionId = visibleEntry.target.id;
        activeLink = links.find((link) => link.getAttribute("href") === `#${sectionId}`) || null;

        links.forEach((link) => link.classList.toggle("active", link === activeLink));
        moveGlider(activeLink);
      },
      { rootMargin: "-30% 0px -58% 0px", threshold: [0, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", () => moveGlider(activeLink));
  updateScrollState();
}

function setupHeroSpotlight() {
  const hero = document.querySelector(".hero");

  if (!hero || reduceMotion) return;

  hero.addEventListener("pointermove", (event) => {
    const rectangle = hero.getBoundingClientRect();
    const x = ((event.clientX - rectangle.left) / rectangle.width) * 100;
    const y = ((event.clientY - rectangle.top) / rectangle.height) * 100;

    hero.style.setProperty("--spot-x", `${x}%`);
    hero.style.setProperty("--spot-y", `${y}%`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--spot-x", "72%");
    hero.style.setProperty("--spot-y", "40%");
  });
}

function showSlide(slider, nextIndex) {
  const images = Array.from(slider.querySelectorAll(".slides img"));
  if (images.length < 2) return;

  const currentIndex = Math.max(0, images.findIndex((image) => image.classList.contains("active")));
  const normalizedIndex = (nextIndex + images.length) % images.length;

  images[currentIndex].classList.remove("active");
  images[normalizedIndex].classList.add("active");
}

function setupProjectSliders() {
  document.querySelectorAll(".project-slider").forEach((slider) => {
    const images = Array.from(slider.querySelectorAll(".slides img"));
    const previousButton = slider.querySelector(".prev");
    const nextButton = slider.querySelector(".next");
    let intervalId = null;

    if (!images.length) return;

    images.forEach((image, index) => image.classList.toggle("active", index === 0));

    const move = (direction) => {
      const currentIndex = Math.max(0, images.findIndex((image) => image.classList.contains("active")));
      showSlide(slider, currentIndex + direction);
    };

    previousButton?.addEventListener("click", () => move(-1));
    nextButton?.addEventListener("click", () => move(1));

    if (images.length > 1 && !reduceMotion) {
      const startAutoPlay = () => {
        window.clearInterval(intervalId);
        intervalId = window.setInterval(() => move(1), 3500);
      };

      const stopAutoPlay = () => window.clearInterval(intervalId);

      slider.addEventListener("mouseenter", stopAutoPlay);
      slider.addEventListener("mouseleave", startAutoPlay);
      slider.addEventListener("focusin", stopAutoPlay);
      slider.addEventListener("focusout", startAutoPlay);
      startAutoPlay();
    }
  });
}

function setupProjectReveal() {
  const cards = document.querySelectorAll(".project-card");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("show"));
    return;
  }

  cards.forEach((card, index) => {
    card.classList.add("reveal");
    card.style.transitionDelay = `${Math.min(index * 0.1, 0.5)}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  cards.forEach((card) => observer.observe(card));
}

function setupCertificateModal() {
  const modal = document.getElementById("certModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeButton = document.getElementById("closeModal");

  if (!modal || !modalTitle || !modalContent) return;

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalContent.textContent = "Certificate preview will show here.";
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-img], [data-file]");
    if (!trigger) return;

    const title = trigger.dataset.title || "Certificate";
    const file = trigger.dataset.img || trigger.dataset.file;
    if (!file) return;

    modalTitle.textContent = title;

    if (file.toLowerCase().endsWith(".pdf")) {
      const frame = document.createElement("iframe");
      frame.src = file;
      frame.title = title;
      modalContent.replaceChildren(frame);
    } else {
      const image = document.createElement("img");
      image.src = file;
      image.alt = title;
      image.addEventListener("error", () => {
        modalContent.textContent = `File not found: ${file}`;
      });
      modalContent.replaceChildren(image);
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeButton?.focus();
  });

  closeButton?.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

function setupProgressiveList({ itemSelector, buttonId, initialCount, step, showAllAtEnd = false }) {
  const items = Array.from(document.querySelectorAll(itemSelector));
  const button = document.getElementById(buttonId);

  if (!button || items.length <= initialCount) {
    if (button) button.hidden = true;
    return;
  }

  let visibleCount = initialCount;

  const update = () => {
    items.forEach((item, index) => {
      item.hidden = index >= visibleCount;
    });

    const allVisible = visibleCount >= items.length;
    button.textContent = allVisible ? "See Less" : "See More";
    button.setAttribute("aria-expanded", String(allVisible));
  };

  button.addEventListener("click", () => {
    if (visibleCount >= items.length) {
      visibleCount = initialCount;
    } else if (showAllAtEnd) {
      visibleCount = items.length;
    } else {
      visibleCount = Math.min(visibleCount + step, items.length);
    }

    update();
  });

  update();
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Sending...";

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Message could not be sent.");
      }

      status.textContent = "Message sent successfully. Thank you!";
      form.reset();
    } catch (error) {
      console.error(error);
      status.textContent = "Could not send the message. Please use the Email Me button.";
    }
  });
}

function setupRating() {
  const stars = Array.from(document.querySelectorAll("#ratingStars button"));
  const status = document.getElementById("ratingStatus");
  const average = document.getElementById("ratingAverage");

  if (!stars.length || !status || !average) return;

  const highlight = (rating) => {
    stars.forEach((star) => star.classList.toggle("active", Number(star.dataset.rate) <= rating));
  };

  try {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const ratingReference = ref(database, "portfolioRating");

    onValue(
      ratingReference,
      (snapshot) => {
        const data = snapshot.val();
        if (!data?.count) {
          average.textContent = "No ratings yet.";
          return;
        }

        average.textContent = `${(data.total / data.count).toFixed(1)} / 5 from ${data.count} rating${data.count === 1 ? "" : "s"}`;
      },
      () => {
        average.textContent = "Rating is temporarily unavailable.";
      },
    );

    const previousRating = Number(localStorage.getItem("portfolioRated"));
    if (previousRating) {
      highlight(previousRating);
      status.textContent = `You already rated this website ${previousRating}/5.`;
    }

    stars.forEach((star) => {
      star.addEventListener("click", async () => {
        if (localStorage.getItem("portfolioRated")) {
          status.textContent = "You already rated this website.";
          return;
        }

        const rating = Number(star.dataset.rate);
        stars.forEach((item) => { item.disabled = true; });

        try {
          await runTransaction(ratingReference, (current) => ({
            total: (current?.total || 0) + rating,
            count: (current?.count || 0) + 1,
          }));

          localStorage.setItem("portfolioRated", String(rating));
          highlight(rating);
          status.textContent = `Thank you! You rated ${rating}/5.`;
        } catch (error) {
          console.error(error);
          status.textContent = "Rating could not be saved. Please try again.";
          stars.forEach((item) => { item.disabled = false; });
        }
      });
    });
  } catch (error) {
    console.error(error);
    average.textContent = "Rating is temporarily unavailable.";
  }
}

function setCurrentYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

setupIntro();
setupMobileMenu();
setupNavigation();
setupHeroSpotlight();
setupProjectSliders();
setupProjectReveal();
setupCertificateModal();
setupProgressiveList({
  itemSelector: "#experience .timeline-item",
  buttonId: "seeMoreExperience",
  initialCount: 3,
  step: 3,
});
setupProgressiveList({
  itemSelector: ".cert-list .cert",
  buttonId: "seeMoreCerts",
  initialCount: 6,
  step: 6,
  showAllAtEnd: true,
});
setupContactForm();
setupRating();
setCurrentYear();
