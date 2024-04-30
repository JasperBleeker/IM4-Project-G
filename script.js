document.addEventListener("DOMContentLoaded", function() {
    var menuButton = document.querySelector(".menu-btn");
    var mainMenu = document.querySelector(".main-menu");
  
    menuButton.addEventListener("click", function() {
      mainMenu.classList.toggle("show");
    });
  });
  