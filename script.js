// ======================
// INTRO SEQUENCE
// logo digambar -> ketik tagline -> tirai terangkat -> hero muncul
// ======================

const root = document.documentElement;
const intro = document.querySelector(".intro");
const typingEl = document.getElementById("typing");
const introText = "Traditional Artist";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let timers = [];
let finished = false;

function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
}

function typeText() {
    let i = 0;
    (function step() {
        if (i <= introText.length) {
            typingEl.textContent = introText.slice(0, i);
            i++;
            later(step, 70);
        }
    })();
}

function endIntro() {
    if (finished) return;
    finished = true;

    timers.forEach(clearTimeout);
    timers = [];

    if (!intro) {
        root.classList.add("ready");
        return;
    }

    typingEl.textContent = introText;
    intro.classList.add("exit");

    // hero mulai muncul saat tirai sedang naik
    setTimeout(() => root.classList.add("ready"), reduceMotion ? 0 : 350);
    setTimeout(() => intro.remove(), 1300);
}

if (!intro || reduceMotion) {
    if (intro) intro.remove();
    root.classList.add("ready");
} else {
    const fontsReady = document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    // tunggu font Poppins siap (maks 1.2 detik) biar logo nggak "loncat"
    Promise.race([
        fontsReady,
        new Promise(resolve => setTimeout(resolve, 1200))
    ]).then(() => {
        if (finished) return;
        intro.classList.add("play");
        later(typeText, 1300);
        later(endIntro, 3400);
    });

    // klik di mana aja untuk skip intro
    intro.addEventListener("click", endIntro);
}

// ======================
// LIGHTBOX
// ======================

const cardImages = document.querySelectorAll(".card img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");

function closeLightbox() {
    lightbox.classList.remove("open");
}

cardImages.forEach(img => {
    img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("open");
    });
});

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
});

// ======================
// NAVBAR SCROLL
// ======================

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 80);
}, { passive: true });

// ======================
// SCROLL REVEAL
// ======================

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        const el = entry.target;

        // kartu portfolio muncul berurutan
        if (el.classList.contains("card")) {
            const index = [...el.parentElement.children].indexOf(el);
            el.style.animationDelay = (index * 0.12) + "s";
        }

        el.classList.add("show");
        observer.unobserve(el);

    });

}, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

hiddenElements.forEach((el) => observer.observe(el));