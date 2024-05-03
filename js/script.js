


// Hambuger Menu

const menu_btn = document.querySelector('.hamburger-menu');
const menu = document.querySelector('.mobile-nav');

menu_btn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

// Standort Dropdown

document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.standort-button');
  const dropdownContent = document.querySelector('.dropdown-content');

  button.addEventListener('click', function() {
      // Wechselt die Sichtbarkeit des Dropdown-Inhalts
      if (dropdownContent.style.display === 'none') {
          dropdownContent.style.display = 'block';
      } else {
          dropdownContent.style.display = 'none';
      }
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