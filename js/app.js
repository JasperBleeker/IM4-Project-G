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


    // Parking lot data API

    let apiUrl = 'https://api.parkendd.de/Zuerich';
    const searchbar = document.getElementById('search');
    let allData = [];

    // Fetch the API data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API Data:", data); // Log the data to see its structure

            // Check if the 'lots' key is available and is an array
            if (data.lots && Array.isArray(data.lots)) {
                allData = processData(data.lots); // Process the data and store it in a variable
                displayParkingLots(allData);
            } else {
                console.error('Unexpected data structure:', data);
                return;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function processData(data) {
        return data.map(lot => ({
            name: lot.name,
            free: lot.free,
            total: lot.total,
            latitude: lot.coords ? lot.coords.lat : null,
            longitude: lot.coords ? lot.coords.lng : null
        }));
    }

    // Function to display parking lots information
    function displayParkingLots(data) {
        const parkinglotContainer = document.getElementById('parkinglot-box');
        parkinglotContainer.innerHTML = ''; // Clear previous data
        data.forEach(parkinglot => {
            const parkinglotElement = document.createElement('div');
            parkinglotElement.className = 'parkinglot';

            const parkingLotNameHTML = parkinglot.latitude !== null && parkinglot.longitude !== null
                ? `<a href="https://www.google.com/maps/search/?api=1&query=${parkinglot.latitude},${parkinglot.longitude}" target="_blank"><div class="route-link"><h3>Route</h3><svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25.7918 17.527C25.0382 16.7827 24.2847 16.0255 23.5181 15.2812C23.4142 15.1785 23.3102 15.063 23.1933 14.9603C23.1338 14.9009 23.063 14.8537 22.985 14.8215C22.9069 14.7893 22.8232 14.7727 22.7386 14.7727C22.654 14.7727 22.5702 14.7893 22.4921 14.8215C22.4141 14.8537 22.3433 14.9009 22.2838 14.9603C22.2229 15.02 22.1746 15.091 22.1416 15.1691C22.1086 15.2473 22.0917 15.3312 22.0917 15.4159C22.0917 15.5006 22.1086 15.5845 22.1416 15.6627C22.1746 15.7409 22.2229 15.8118 22.2838 15.8715L23.765 17.3345H9.53815C8.77317 17.3345 8.03953 17.0343 7.49861 16.5C6.95769 15.9658 6.65381 15.2411 6.65381 14.4855C6.65381 13.7299 6.95769 13.0052 7.49861 12.471C8.03953 11.9367 8.77317 11.6365 9.53815 11.6365H13.4359C13.9844 11.6365 14.5276 11.5298 15.0344 11.3224C15.5412 11.1151 16.0017 10.8112 16.3896 10.428C16.7774 10.0449 17.0851 9.59008 17.295 9.0895C17.505 8.58892 17.613 8.05241 17.613 7.51058C17.613 6.96876 17.505 6.43224 17.295 5.93166C17.0851 5.43108 16.7774 4.97625 16.3896 4.59312C16.0017 4.20999 15.5412 3.90608 15.0344 3.69873C14.5276 3.49139 13.9844 3.38467 13.4359 3.38467H6.58884C6.42785 2.60566 5.97976 1.91344 5.33143 1.44222C4.6831 0.970993 3.88073 0.754335 3.07987 0.834247C2.27901 0.914159 1.53671 1.28495 0.996899 1.87473C0.457083 2.46451 0.158203 3.23126 0.158203 4.02633C0.158203 4.82141 0.457083 5.58816 0.996899 6.17794C1.53671 6.76772 2.27901 7.13851 3.07987 7.21842C3.88073 7.29833 4.6831 7.08167 5.33143 6.61045C5.97976 6.13923 6.42785 5.44701 6.58884 4.668H13.4359C14.1992 4.668 14.9311 4.96749 15.4708 5.50057C16.0105 6.03366 16.3138 6.75668 16.3138 7.51058C16.3138 8.26448 16.0105 8.98751 15.4708 9.52059C14.9311 10.0537 14.1992 10.3532 13.4359 10.3532H9.53815C8.98875 10.3532 8.44473 10.4601 7.93715 10.6677C7.42958 10.8754 6.96838 11.1798 6.5799 11.5635C6.19142 11.9472 5.88325 12.4028 5.67301 12.9041C5.46276 13.4055 5.35455 13.9428 5.35455 14.4855C5.35455 15.0282 5.46276 15.5655 5.67301 16.0669C5.88325 16.5682 6.19142 17.0238 6.5799 17.4075C6.96838 17.7912 7.42958 18.0956 7.93715 18.3033C8.44473 18.5109 8.98875 18.6178 9.53815 18.6178H23.778L22.6086 19.7728C22.4917 19.8755 22.3878 19.991 22.2838 20.0937C22.2229 20.1533 22.1746 20.2243 22.1416 20.3025C22.1086 20.3807 22.0917 20.4645 22.0917 20.5492C22.0917 20.634 22.1086 20.7178 22.1416 20.796C22.1746 20.8742 22.2229 20.9452 22.2838 21.0048C22.4069 21.1192 22.5696 21.1828 22.7386 21.1828C22.9075 21.1828 23.0702 21.1192 23.1933 21.0048L25.467 18.759L25.7918 18.4382C25.8527 18.3785 25.901 18.3075 25.934 18.2294C25.967 18.1512 25.984 18.0673 25.984 17.9826C25.984 17.8979 25.967 17.814 25.934 17.7358C25.901 17.6576 25.8527 17.5867 25.7918 17.527ZM3.40567 5.95133C3.02022 5.95133 2.64342 5.83843 2.32293 5.62691C2.00244 5.41539 1.75265 5.11475 1.60514 4.763C1.45764 4.41125 1.41904 4.0242 1.49424 3.65078C1.56944 3.27737 1.75505 2.93437 2.02761 2.66515C2.30016 2.39594 2.64742 2.2126 3.02546 2.13832C3.40351 2.06405 3.79536 2.10217 4.15148 2.24787C4.50759 2.39356 4.81196 2.6403 5.02611 2.95686C5.24025 3.27343 5.35455 3.6456 5.35455 4.02633C5.35455 4.53688 5.14922 5.02651 4.78374 5.38751C4.41825 5.74852 3.92255 5.95133 3.40567 5.95133Z" fill="#2DCB74"/>
                </svg></div></a>`
                

                : `<h3>Nicht vervügbar</h3>`;

            parkinglotElement.innerHTML = `
                <div class="parkinglot-info">
                <p class:"anz-frei"> ${parkinglot.free}</p>
                <p class:"freie-text">Freie Parkplätze</p>
                </div>
                <h3>${parkinglot.name}</h3>
                ${parkingLotNameHTML}
                
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
