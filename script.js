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

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");

function closeLightbox() {
    lightbox.classList.remove("open");
}

// klik foto portfolio / foto contoh komisi -> perbesar
document.addEventListener("click", (e) => {
    const img = e.target.closest(".card img, .c-photo img");
    if (!img) return;
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
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


// ======================
// COMMISSION PRICES
// ======================
// Mau ubah harga / kurs / nomor WhatsApp? Cukup edit bagian CONFIG ini.

// --- CONFIG -------------------------------------------------
const WA_NUMBER = "6281210663582";

// Kurs: Rupiah per 1 US Dollar (update kalau kurs berubah jauh)
const USD_RATE = 17900;

// Mau harga dollar manual untuk harga tertentu? Contoh: { 30000: 2, 500000: 30 }
// Kalau tidak diisi, dollar dihitung otomatis dari kurs (dibulatkan ke $0.50).
const USD_OVERRIDE = {};

// Folder foto contoh. Nama file: {gaya}-{pose}-{tipe}.jpg
// contoh: anime-headshot-bw.jpg, anime-halfbody-color.jpg, realistic-fullbody-bw.jpg
// Format yang dikenali: jpg, png, webp, jpeg
const PHOTO_DIR = "images/commission/";
const PHOTO_EXTS = ["jpg", "png", "webp", "jpeg"];

const POSES = [
    { key: "headshot", label: "Headshot",  desc: "Face & shoulders" },
    { key: "halfbody", label: "Half Body", desc: "Waist up" },
    { key: "fullbody", label: "Full Body", desc: "Head to toe" }
];

const VARIANTS = { bw: "Black & White", color: "Coloring" };

const PRICES = {
    anime: {
        label: "Anime",
        A4: {
            headshot: { bw: 30000, color: 60000 },
            halfbody: { bw: 40000, color: 80000 },
            fullbody: { bw: 60000, color: 120000 }
        },
        A3: {
            headshot: { bw: 40000, color: 80000 },
            halfbody: { bw: 50000, color: 100000 },
            fullbody: { bw: 70000, color: 140000 }
        }
    },
    realistic: {
        label: "Realistic",
        A4: {
            headshot: { bw: 70000 },
            halfbody: { bw: 200000 },
            fullbody: { bw: 350000 }
        },
        A3: {
            headshot: { bw: 100000 },
            halfbody: { bw: 250000 },
            fullbody: { bw: 500000 }
        }
    }
};
// ------------------------------------------------------------

const cGrid = document.getElementById("c-grid");
const cHint = document.getElementById("c-hint");
const cNote = document.getElementById("c-note");
const segStyle = document.getElementById("seg-style");
const segSize = document.getElementById("seg-size");

const cState = {
    style: "anime",
    size: "A4",
    variant: { headshot: "bw", halfbody: "bw", fullbody: "bw" }
};

const dots = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtIDR = n => "Rp" + dots(n);

function toUSD(idr) {
    if (USD_OVERRIDE[idr] != null) return USD_OVERRIDE[idr];
    return Math.max(0.5, Math.round((idr / USD_RATE) * 2) / 2);
}
const fmtUSD = n => "$" + (Number.isInteger(n) ? n : n.toFixed(2));

// ---------- foto contoh (otomatis terdeteksi dari folder) ----------

const photoCache = new Map();   // key -> url | null
const photoPending = new Map();

function findPhoto(key) {
    if (photoCache.has(key)) return Promise.resolve(photoCache.get(key));
    if (photoPending.has(key)) return photoPending.get(key);

    const task = (async () => {
        for (const ext of PHOTO_EXTS) {
            const url = PHOTO_DIR + key + "." + ext;
            const ok = await new Promise(resolve => {
                const im = new Image();
                im.onload = () => resolve(true);
                im.onerror = () => resolve(false);
                im.src = url;
            });
            if (ok) {
                photoCache.set(key, url);
                return url;
            }
        }
        photoCache.set(key, null);
        return null;
    })();

    photoPending.set(key, task);
    return task;
}

function hydratePhoto(el) {
    const key = el.dataset.photo;
    if (el.classList.contains("has-photo")) return;

    findPhoto(key).then(url => {
        if (!url || !el.isConnected || el.dataset.photo !== key) return;
        if (el.querySelector("img")) return;

        const img = document.createElement("img");
        img.alt = el.dataset.alt || "Sample artwork";
        img.src = url;
        el.appendChild(img);
        el.classList.add("has-photo");
        requestAnimationFrame(() => img.classList.add("in"));
    });
}

// ---------- kartu ----------

const PENCIL_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';

function cardHTML(pose, opts) {
    const data = PRICES[cState.style][cState.size][pose.key];
    const variants = Object.keys(data);

    let v = cState.variant[pose.key];
    if (!data[v]) v = variants[0];

    const idr = data[v];
    const usd = toUSD(idr);
    const key = `${cState.style}-${pose.key}-${v}`;
    const cachedUrl = photoCache.get(key);
    const styleLabel = PRICES[cState.style].label;

    const typeControl = variants.length > 1
        ? `<div class="vt" role="group" aria-label="Drawing type">` +
          variants.map(k =>
              `<button type="button" data-variant="${k}" class="${k === v ? "active" : ""}">${VARIANTS[k]}</button>`
          ).join("") +
          `</div>`
        : `<div class="vt single"><span>${VARIANTS[v]} only</span></div>`;

    const photo = cachedUrl
        ? `<img class="in" src="${cachedUrl}" alt="${styleLabel} ${pose.label} sample">`
        : "";

    return `
        <div class="c-photo ${cachedUrl ? "has-photo" : ""}" data-photo="${key}" data-alt="${styleLabel} ${pose.label} sample">
            <div class="c-ph">${PENCIL_ICON}<span>Sample coming soon</span></div>
            ${photo}
            <span class="c-badge">${styleLabel} · ${cState.size}</span>
        </div>

        <div class="c-body">

            <div class="c-head">
                <h3>${pose.label}</h3>
                <p>${pose.desc}</p>
            </div>

            ${typeControl}

            <div class="c-price ${opts && opts.swap ? "swap" : ""}">
                <span class="c-idr">${fmtIDR(idr)}</span>
                <span class="c-usd"><i>≈</i> ${fmtUSD(usd)} <i>USD</i></span>
            </div>

            <button type="button" class="c-order">Order ${pose.label}</button>

        </div>
    `;
}

function buildCard(pose, opts) {
    const card = document.createElement("div");
    card.className = "c-card";
    card.dataset.pose = pose.key;
    card.innerHTML = cardHTML(pose, opts);
    hydratePhoto(card.querySelector(".c-photo"));
    return card;
}

function renderGrid(animate) {
    cGrid.innerHTML = "";

    POSES.forEach((pose, i) => {
        const card = buildCard(pose);
        if (animate) {
            card.style.animationDelay = (i * 0.09) + "s";
            card.classList.add("enter");
        }
        cGrid.appendChild(card);
    });

    const isAnime = cState.style === "anime";
    cHint.textContent = isAnime
        ? "Choose Black & White or Coloring on each card."
        : "Realistic style is available in Black & White only.";
    cNote.textContent =
        `USD prices are approximate (≈ Rp${dots(USD_RATE)} per US$1) for international customers.`;
}

// ---------- toggle gaya & ukuran ----------

function placeIndicator(seg) {
    const ind = seg.querySelector(".seg-ind");
    const btn = seg.querySelector("button.active");
    if (!ind || !btn) return;
    ind.style.width = btn.offsetWidth + "px";
    ind.style.transform = `translateX(${btn.offsetLeft}px)`;
}

function bindSegment(seg, onChange) {
    seg.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn || btn.classList.contains("active")) return;
        seg.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
        placeIndicator(seg);
        onChange(btn.dataset.value);
    });
}

bindSegment(segStyle, (value) => {
    cState.style = value;
    renderGrid(true);
});

bindSegment(segSize, (value) => {
    cState.size = value;
    renderGrid(true);
});

// ---------- klik di dalam kartu (type & order) ----------

cGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".c-card");
    if (!card) return;

    const pose = POSES.find(p => p.key === card.dataset.pose);

    // ganti Black & White <-> Coloring
    const vBtn = e.target.closest(".vt button");
    if (vBtn) {
        cState.variant[pose.key] = vBtn.dataset.variant;
        card.replaceWith(buildCard(pose, { swap: true }));
        return;
    }

    // order via WhatsApp
    if (e.target.closest(".c-order")) {
        const data = PRICES[cState.style][cState.size][pose.key];
        let v = cState.variant[pose.key];
        if (!data[v]) v = Object.keys(data)[0];

        const idr = data[v];
        const msg =
            "Hi Moru Art, I want to order a drawing:\n" +
            `• Style: ${PRICES[cState.style].label}\n` +
            `• Size: ${cState.size}\n` +
            `• Pose: ${pose.label}\n` +
            `• Type: ${VARIANTS[v]}\n` +
            `• Price: ${fmtIDR(idr)} (≈ ${fmtUSD(toUSD(idr))})`;

        window.open(
            "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg),
            "_blank",
            "noopener"
        );
    }
});

// ---------- start ----------

renderGrid(false);
placeIndicator(segStyle);
placeIndicator(segSize);

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        placeIndicator(segStyle);
        placeIndicator(segSize);
    });
}
window.addEventListener("load", () => {
    placeIndicator(segStyle);
    placeIndicator(segSize);
});
window.addEventListener("resize", () => {
    placeIndicator(segStyle);
    placeIndicator(segSize);
});

// kartu muncul berurutan saat section komisi pertama kali terlihat
const commissionSection = document.getElementById("commission");
if (commissionSection && "IntersectionObserver" in window) {
    const firstView = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        placeIndicator(segStyle);
        placeIndicator(segSize);
        cGrid.querySelectorAll(".c-card").forEach((card, i) => {
            card.style.animationDelay = (0.15 + i * 0.12) + "s";
            card.classList.add("enter");
        });
        firstView.disconnect();
    }, { threshold: 0.2 });
    firstView.observe(commissionSection);
}