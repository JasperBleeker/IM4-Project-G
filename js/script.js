


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

// rotate svg dropdown

let rotated = false;

$('#standort-button').click(function() {
  if (rotated) {
    $('.svg-dropdown').css('transform', 'rotate(0deg)');
  } else {
    $('.svg-dropdown').css('transform', 'rotate(180deg)');
  }
  rotated = !rotated;
});

//Slider JS

$('#myRange')
  .slider({
    min: 0,
    max: 900,
    step: 15,
    value: 0,
    tooltip: 'hide',
    ticks: [0, 180, 360, 540, 720, 900, 1080, 1260, 1440],
    ticks_labels: [
      '12:00 AM', 
      '03:00 AM', 
      '06:00 AM', 
      '09:00 AM', 
      '12:00 PM', 
      '03:00 PM', 
      '06:00 PM', 
      '09:00 PM', 
      '12:00 AM'
    ],
    ticks_snap_bounds: 15
  })
  .on('slide', (e) => {
    let hrs = Math.floor(e.value / 60)
    let min = e.value - (hrs * 60)

    if (hrs.length === 1) hrs = '0' + hrs
    if (min.length === 1) min = '0' + min
    if (min === 0) min = '00'
    if (hrs >= 12) {
      if (hrs === 12) min = min + ' PM'
      else {
        hrs = hrs - 12
        min = min + ' PM'
      }
    } 
    else {
      min = min + ' AM'
    }
    if (hrs === 0) {
      hrs = 12
    }

    $('#slider-number').html(hrs + ':' + min)
  })

$($('.slider-track-low'))
  .clone()
  .addClass('slider-track-total')
  .css({ width: '62.5%' })
  .appendTo('.slider-track')

// Text Changer
let words = document.querySelectorAll(".word");
words.forEach(word => {
  let letters = word.textContent.split("");
  word.textContent = "";
  letters.forEach(letter => {
    let span = document.createElement("span");
    span.textContent = letter;
    span.className = "letter";
    word.append(span);
  });
});

let currentWordIndex = 0;
let maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";

let rotateText = () => {
  let currentWord = words[currentWordIndex];
  let nextWord =
    currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
  // rotate out letters of current word
  Array.from(currentWord.children).forEach((letter, i) => {
    setTimeout(() => {
      letter.className = "letter out";
    }, i * 80);
  });
  // reveal and rotate in letters of next word
  nextWord.style.opacity = "1";
  Array.from(nextWord.children).forEach((letter, i) => {
    letter.className = "letter behind";
    setTimeout(() => {
      letter.className = "letter in";
    }, 340 + i * 80);
  });
  currentWordIndex =
    currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};

rotateText();
setInterval(rotateText, 4000);