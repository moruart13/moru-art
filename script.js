console.log("Website berhasil dibuat 🚀");
window.addEventListener("load",()=>{

document.body.style.opacity="1";

});
const cards = document.querySelectorAll(".card img");

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.getElementById("close");

cards.forEach(card=>{

card.onclick=()=>{

lightbox.style.display="flex";

lightboxImg.src=card.src;

}

})

closeBtn.onclick=()=>{

lightbox.style.display="none";

}

lightbox.onclick=(e)=>{

if(e.target===lightbox){

lightbox.style.display="none";

}

}
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");

    if (window.scrollY > 80) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {

    if(window.scrollY > 80){

        nav.classList.add("scrolled");

    }else{

        nav.classList.remove("scrolled");

    }

});
// Fade-in body saat halaman dibuka
window.addEventListener("load", () => {
    document.body.style.opacity = "1";
});

// Scroll animation
const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }

    });
});

hiddenElements.forEach((el)=>{
    observer.observe(el);
});