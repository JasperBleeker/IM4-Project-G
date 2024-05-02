document.addEventListener("DOMContentLoaded", function() {
    var menuButton = document.querySelector(".menu-btn");
    var mainMenu = document.querySelector(".main-menu");
  
    menuButton.addEventListener("click", function() {
      mainMenu.classList.toggle("show");
    });
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