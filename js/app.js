document.addEventListener('DOMContentLoaded', function () {

    // Toggle mobile navigation
    const menu_btn = document.querySelector('.hamburger-menu');
    const menu = document.querySelector('.mobile-nav');
    menu_btn.addEventListener('click', () => {
        menu.classList.toggle('open');
    });

    // Animate words in the footer
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
        let nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
        Array.from(currentWord.children).forEach((letter, i) => {
            setTimeout(() => { letter.className = "letter out"; }, i * 80);
        });
        nextWord.style.opacity = "1";
        Array.from(nextWord.children).forEach((letter, i) => {
            letter.className = "letter behind";
            setTimeout(() => { letter.className = "letter in"; }, 340 + i * 80);
        });
        currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
    };

    rotateText();
    setInterval(rotateText, 4000);

    let apiUrl = 'https://api.parkendd.de/Zuerich'
    const searchbar = document.getElementById('search');
    let allData = [];

    // Fetch the API data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API Data:", data); // Log the data to see its structure

            // Check if the 'lots' key is available and is an array
            if (data.lots && Array.isArray(data.lots)) {
                allData = data.lots; // Use the 'lots' array for further processing
                displayParkingLots(allData);
            } else {
                console.error('Unexpected data structure:', data);
                return;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Function to display parking lots information
    function displayParkingLots(data) {
        const parkinglotContainer = document.getElementById('parkinglot-box');
        parkinglotContainer.innerHTML = ''; // Clear previous data
        data.forEach(parkinglot => {
            const parkinglotElement = document.createElement('div');
            parkinglotElement.className = 'parkinglot';
            parkinglotElement.innerHTML = `
                <h3>${parkinglot.name}</h3>
                <p>Freie Plätze: ${parkinglot.free}</p>
                <p>Belegte Plätze: ${parkinglot.total - parkinglot.free}</p>
                <p>Maximale Kapazität: ${parkinglot.total}</p>
            `;
            parkinglotContainer.appendChild(parkinglotElement);
        });
    }

    // Function to filter parking lots based on user input in the search bar
    function filterParkingLots() {
        const searchText = searchbar.value.toLowerCase();
        const filteredData = allData.filter(parkinglot =>
            parkinglot.name.toLowerCase().includes(searchText)
        );
        displayParkingLots(filteredData);
    }

    searchbar.addEventListener('input', filterParkingLots);

});
