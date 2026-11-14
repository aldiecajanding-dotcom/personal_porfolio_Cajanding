const loader = document.querySelector(".page-loader");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = document.querySelectorAll(".reveal");
const canvas = document.querySelector(".particle-canvas");
const pointerGlow = document.querySelector(".pointer-glow");
const scrollProgress = document.querySelector(".scroll-progress");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("is-hidden"), 650);
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mainNav.classList.remove("is-open");
  }
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 },
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-30% 0px -60% 0px" },
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress, { passive: true });
updateScrollProgress();

const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = formData.get("name").toString().trim();
  const email = formData.get("email").toString().trim();
  const message = formData.get("message").toString().trim();
  const subject = encodeURIComponent(`Portfolio hello from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom ${name} (${email})`);
  const recipient = "aldie.cajanding@gmail.com";

  document.querySelector(".form-status").textContent = "Opening your email app to send this message…";
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

if (canvas && !reducedMotion.matches) {
  const context = canvas.getContext("2d");
  const particles = [];
  let animationFrame;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function resizeCanvas() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    particles.length = 0;
    const count = Math.min(42, Math.floor((width * height) / 27000));

    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.1 + 0.35,
        opacity: Math.random() * 0.36 + 0.12,
        drift: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawParticles(time = 0) {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      const shimmer = 0.55 + Math.sin(time * 0.0007 + particle.phase) * 0.45;
      particle.y -= 0.12;
      particle.x += particle.drift;
      if (particle.y < -2) particle.y = height + 2;
      if (particle.x < -2) particle.x = width + 2;
      if (particle.x > width + 2) particle.x = -2;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(133, 216, 240, ${particle.opacity * shimmer})`;
      context.fill();
    });
    animationFrame = window.requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      animationFrame = window.requestAnimationFrame(drawParticles);
    }
  });
}

if (pointerGlow && window.matchMedia("(pointer: fine)").matches && !reducedMotion.matches) {
  let moveFrame = 0;
  window.addEventListener(
    "pointermove",
    (event) => {
      if (moveFrame) return;
      moveFrame = window.requestAnimationFrame(() => {
        pointerGlow.style.transform = `translate(${event.clientX - 180}px, ${event.clientY - 180}px)`;
        moveFrame = 0;
      });
    },
    { passive: true },
  );
}

// A lightweight workshop-style spotlight follows the pointer over interactive cards.
if (window.matchMedia("(pointer: fine)").matches && !reducedMotion.matches) {
  const spotlightItems = document.querySelectorAll(".passion-card, .bike-card, .project-visual, .milestone-card, .signal-card, .education-card, .skill-board, .skills-note, .terminal, .contact-form");
  spotlightItems.forEach((card) => {
    card.classList.add("spotlight-card");
    const glow = document.createElement("span");
    glow.className = "card-glow";
    glow.setAttribute("aria-hidden", "true");
    card.append(glow);
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });
}

// Interactive RPM meter: the hidden range control keeps the decorative gauge keyboard-accessible.
const rpmControl = document.querySelector(".rpm-control");
const tachometer = document.querySelector(".tachometer");
if (rpmControl && tachometer) {
  const updateRpm = () => {
    const value = Number(rpmControl.value);
    tachometer.dataset.rpm = String(value);
    tachometer.querySelector("b").textContent = String(value);
    const degrees = -52 + ((value - 1) / 9) * 120;
    tachometer.querySelector("i").style.transform = `rotate(${degrees}deg)`;
  };
  rpmControl.addEventListener("input", updateRpm);
  updateRpm();
}

// Gallery lightbox for the dream-machine cards.
const lightbox = document.querySelector(".lightbox");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCopy = document.querySelector(".lightbox-copy p");
const closeLightbox = () => {
  lightbox?.classList.remove("is-open");
  lightbox?.setAttribute("aria-hidden", "true");
};
document.querySelectorAll(".bike-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (!lightbox) return;
    lightboxTitle.textContent = card.dataset.lightboxTitle;
    lightboxCopy.textContent = card.dataset.lightboxCopy;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});
document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

// Lightweight terminal: commands are intentionally informational and easy to extend.
const terminalForm = document.querySelector(".terminal-form");
const terminalInput = document.querySelector("#terminal-input");
const terminalOutput = document.querySelector(".terminal-output");
const terminalCommands = {
  help: "Commands: about · skills · projects · contact · clear",
  about: "Aldie is an IT student with a mechanic’s mindset: curious, patient, and built to troubleshoot.",
  skills: "HTML · CSS · JavaScript · Java · PHP · MySQL · web development · computer troubleshooting · UI/UX",
  projects: "Open the workshop projects section to explore three replaceable school-project concepts.",
  contact: "Open channel: aldie.cajanding@gmail.com",
};
terminalForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = terminalInput.value.trim().toLowerCase();
  if (!command) return;
  if (command === "clear") terminalOutput.innerHTML = "";
  else {
    const response = terminalCommands[command] || `Command not found: ${command}. Type help.`;
    const commandLine = document.createElement("p");
    const commandText = document.createElement("strong");
    commandText.textContent = `> ${command}`;
    commandLine.append(commandText);
    const responseLine = document.createElement("p");
    responseLine.textContent = response;
    terminalOutput.append(commandLine, responseLine);
  }
  terminalInput.value = "";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

// Sound is opt-in. A tiny oscillator click gives the control feedback without shipping audio files.
const soundToggle = document.querySelector(".sound-toggle");
let audioContext;
function playClick() {
  if (!soundToggle?.matches('[aria-pressed="true"]')) return;
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;
  audioContext ||= new AudioContextConstructor();
  if (audioContext.state === "suspended") audioContext.resume();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.frequency.value = 130;
  gain.gain.setValueAtTime(.035, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .08);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + .08);
}
soundToggle?.addEventListener("click", () => {
  const enabled = soundToggle.getAttribute("aria-pressed") === "true";
  soundToggle.setAttribute("aria-pressed", String(!enabled));
  soundToggle.setAttribute("aria-label", `Sound effects are ${enabled ? "muted" : "on"}`);
  soundToggle.textContent = `SOUND / ${enabled ? "OFF" : "ON"}`;
  playClick();
});
