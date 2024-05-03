


// Hambuger Menu

const menu_btn = document.querySelector('.hamburger-menu');
const menu = document.querySelector('.mobile-nav');

menu_btn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

// Standort Dropdown

var mydiv = document.querySelector("#dropdown")
var mybtn = document.querySelector("#standort-button")

mybtn.addEventListener("click", function () {
   mydiv.classList.toggle("dropdown-div")
});



// Marquee Effect
  function Marquee(selector, speed) {
    const parent = document.querySelector(selector);
    const clone = parent.innerHTML;
    let i = 0;
    parent.innerHTML += clone;
  
    setInterval(() => {
      i += speed;
      if (i >= parent.children[0].clientWidth) i = 0;
      parent.children[0].style.marginLeft = `-${i}px`;
    }, 0);
  }
  
  window.addEventListener('load', () => Marquee('.marquee', .3));