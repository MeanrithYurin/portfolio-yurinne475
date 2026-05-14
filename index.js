console.log("script.js is working");

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

// Current year
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Certificate pop-up preview
const modal = document.getElementById("certModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-img]");

  if (!btn) return;

  const img = btn.dataset.img;
  const title = btn.dataset.title;

  if (!modal || !modalTitle || !modalContent) {
    alert("Modal HTML is missing.");
    return;
  }

  modalTitle.textContent = title;

  modalContent.innerHTML = `
    <img 
      src="${img}" 
      alt="${title}" 
      onerror="this.remove(); this.parentElement.textContent='Image not found: ${img}'">
  `;

  modal.classList.add("open");
});

if (closeModal) {
  closeModal.addEventListener("click", () => {
    modal.classList.remove("open");
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });
}

// Contact form
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formStatus.textContent = "Sending...";

    const formData = new FormData(contactForm);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        formStatus.textContent = "Message sent successfully. Thank you!";
        contactForm.reset();
      } else {
        formStatus.textContent =
          result.message || "Something went wrong. Please try again.";
      }
    } catch (error) {
      formStatus.textContent =
        "Network error. Please try again or email me directly.";
    }
  });
}

// Manual slider button click
function moveSlide(button, direction) {
  const slider = button.closest(".project-slider");

  if (!slider) return;

  changeSlide(slider, direction);
}

// Main slider function
function changeSlide(slider, direction) {
  const images = slider.querySelectorAll(".slides img");

  if (images.length <= 1) return;

  let currentIndex = 0;

  images.forEach((img, index) => {
    if (img.classList.contains("active")) {
      currentIndex = index;
    }
  });

  images[currentIndex].classList.remove("active");

  let nextIndex = currentIndex + direction;

  if (nextIndex < 0) {
    nextIndex = images.length - 1;
  }

  if (nextIndex >= images.length) {
    nextIndex = 0;
  }

  images[nextIndex].classList.add("active");
}

// Auto slide every 3 seconds
document.querySelectorAll(".project-slider").forEach((slider) => {
  const images = slider.querySelectorAll(".slides img");

  if (images.length <= 1) return;

  images.forEach((img) => img.classList.remove("active"));
  images[0].classList.add("active");

  setInterval(() => {
    changeSlide(slider, 1);
  }, 3000);
});

// Project card scroll reveal animation
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card, index) => {
  card.classList.add("reveal");
  card.style.transitionDelay = `${index * 0.12}s`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

projectCards.forEach((card) => {
  revealObserver.observe(card);
});

const certCards = document.querySelectorAll(".cert-list .cert");
const seeMoreCertsBtn = document.getElementById("seeMoreCerts");

if (certCards.length > 6 && seeMoreCertsBtn) {
  certCards.forEach((cert, index) => {
    if (index >= 6) {
      cert.classList.add("hidden-cert");
    }
  });

  seeMoreCertsBtn.addEventListener("click", () => {
    const isShowingAll = seeMoreCertsBtn.textContent.trim() === "See Less";

    certCards.forEach((cert, index) => {
      if (index >= 6) {
        cert.classList.toggle("hidden-cert", isShowingAll);
      }
    });

    seeMoreCertsBtn.textContent = isShowingAll ? "See More" : "See Less";
  });
} else if (seeMoreCertsBtn) {
  seeMoreCertsBtn.style.display = "none";
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formStatus.textContent = "Sending...";

    const formData = new FormData(contactForm);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        formStatus.textContent = "Message sent successfully. Thank you!";
        contactForm.reset();
      } else {
        formStatus.textContent =
          result.message || "Something went wrong. Please try again.";
      }
    } catch (error) {
      formStatus.textContent =
        "Network error. Please try again or email me directly.";
    }
  });
}