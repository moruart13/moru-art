// ======================
// INTRO SEQUENCE
// tulisan digambar -> logo muncul -> logo terbang & nempel ke navbar
// ======================

const root = document.documentElement;
const intro = document.querySelector(".intro");
const stage = document.querySelector(".stage");
const flyer = document.querySelector(".intro-logo");
const navLogo = document.querySelector(".logo img");
const typingEl = document.getElementById("typing");
const introText = "Traditional Artist";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// selalu mulai dari paling atas biar posisi navbar bisa diukur dengan benar
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

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

// logo intro sudah "mendarat" -> tampilkan logo asli di navbar
function dock() {
    root.classList.add("docked");
    if (stage) stage.remove();
}

function endIntro(skipped) {
    if (finished) return;
    finished = true;

    timers.forEach(clearTimeout);
    timers = [];

    typingEl.textContent = introText;
    if (skipped === true) stage.classList.add("complete");
    stage.classList.add("leaving");

    // ukur posisi awal (tengah layar) & tujuan (logo navbar)
    // PENTING: diukur sebelum class "ready" supaya navbar belum bergerak
    const from = flyer.getBoundingClientRect();
    const to = navLogo ? navLogo.getBoundingClientRect() : null;

    intro.classList.add("exit");                       // tirai turun
    setTimeout(() => root.classList.add("ready"), 150); // navbar + hero muncul
    setTimeout(() => intro.remove(), 1300);

    if (flyer.animate && to && to.width > 0 && from.width > 0) {

        const dx = to.left - from.left;
        const dy = to.top - from.top;
        const scale = to.width / from.width;

        const flight = flyer.animate(
            [
                { transform: "translate(0px, 0px) scale(1)" },
                { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }
            ],
            { duration: 1000, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" }
        );

        flight.onfinish = dock;
        setTimeout(dock, 1500); // jaga-jaga

    } else {
        setTimeout(dock, 600);
    }
}

if (!intro || !stage || reduceMotion) {
    if (intro) intro.remove();
    if (stage) stage.remove();
    root.classList.add("ready", "docked");
} else {
    const fontsReady = document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    // tunggu font (untuk tagline) maks 1.2 detik
    Promise.race([
        fontsReady,
        new Promise(resolve => setTimeout(resolve, 1200))
    ]).then(() => {
        if (finished) return;
        stage.classList.add("play");
        later(typeText, 1400);
        later(endIntro, 3200);
    });

    // klik di mana aja untuk skip intro
    intro.addEventListener("click", () => endIntro(true));

    // pengaman: kalau ada yang gagal, web tetap kebuka
    setTimeout(() => root.classList.add("ready", "docked"), 9000);
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