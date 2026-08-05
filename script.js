// Typing intro

const text = "Traditional Artist";

let i = 0;


function typing(){

    if(i < text.length){

        document.getElementById("typing").innerHTML += text.charAt(i);

        i++;

        setTimeout(typing,120);

    }

}


setTimeout(typing,1500);
console.log("Website berhasil dibuat 🚀");

// ======================
// PAGE LOAD
// ======================

window.addEventListener("load", () => {
    document.body.style.opacity = "1";
    document.body.style.overflow = "auto";
});

// ======================
// LIGHTBOX
// ======================

const cards = document.querySelectorAll(".card img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");

cards.forEach(card => {

    card.addEventListener("click", () => {

        lightbox.style.display = "flex";
        lightboxImg.src = card.src;

    });

});

closeBtn.addEventListener("click", () => {

    lightbox.style.display = "none";

});

lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) {

        lightbox.style.display = "none";

    }

});

// ======================
// NAVBAR SCROLL
// ======================

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        nav.classList.add("scrolled");

    } else {

        nav.classList.remove("scrolled");

    }

});

// ======================
// SCROLL ANIMATION
// ======================
console.log("Scroll animation aktif");

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

hiddenElements.forEach((el) => {

    observer.observe(el);

});
