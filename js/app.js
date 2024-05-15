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

    let apiUrl = 'https://api.parkendd.de/Zuerich';
    const searchbar = document.getElementById('search');
    let allData = [];

    // Check if geolocation is available and get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log("API Data:", data); // Log the data to see its structure

                    if (data.lots && Array.isArray(data.lots)) {
                        allData = processData(data.lots, userLatitude, userLongitude); // Process and sort the data based on distance
                        displayParkingLots(allData);
                    } else {
                        console.error('Unexpected data structure:', data);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }, () => {
            alert("Unable to retrieve your location. Displaying unsorted parking lots.");
            // Fall back to displaying unsorted parking lots if location cannot be retrieved
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.lots && Array.isArray(data.lots)) {
                        allData = processData(data.lots); // Process without sorting by distance
                        displayParkingLots(allData);
                    } else {
                        console.error('Unexpected data structure:', data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching parking lots:', error);
                });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    function processData(data, userLatitude, userLongitude) {
        return data.map(lot => {
            const latitude = lot.coords ? lot.coords.lat : null;
            const longitude = lot.coords ? lot.coords.lng : null;
            const distance = (latitude !== null && longitude !== null && userLatitude !== undefined && userLongitude !== undefined)
                ? getDistanceFromLatLonInKm(userLatitude, userLongitude, latitude, longitude)
                : null;

            return {
                name: lot.name,
                free: lot.free,
                total: lot.total,
                latitude,
                longitude,
                distance
            };
        })
            .filter(lot => lot.distance !== null) // Keep only lots with a calculated distance
            .sort((a, b) => a.distance - b.distance); // Sort by distance
    }

    function displayParkingLots(data) {
        const parkinglotContainer = document.getElementById('parkinglot-box');
        parkinglotContainer.innerHTML = ''; // Clear previous data
        data.forEach(parkinglot => {
            const parkinglotElement = document.createElement('div');
            parkinglotElement.className = 'parkinglot';

            // Determine the color based on the number of free spaces
            let colorClass = 'green'; // Default is green
            if (parkinglot.free === 0) {
                colorClass = 'red';
            } else if (parkinglot.free <= 10) {
                colorClass = 'orange';
            }

            const parkingLotNameHTML = parkinglot.latitude !== null && parkinglot.longitude !== null
                ? `<a class="route" href="https://www.google.com/maps/dir/?api=1&destination=${parkinglot.latitude},${parkinglot.longitude}" target="_blank"><div class="route-link"><h3>Route</h3><svg class="route-icon" width="40" height="20" viewBox="0 0 20 16" fill="${colorClass === 'green' ? '#2ecc71' : (colorClass === 'orange' ? '#f39c12' : '#e74c3c')}" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.976 12.6622C18.4443 12.1305 17.9127 11.5897 17.3718 11.058C17.2985 10.9847 17.2252 10.9022 17.1427 10.8288C17.1007 10.7864 17.0508 10.7527 16.9957 10.7297C16.9406 10.7067 16.8815 10.6948 16.8218 10.6948C16.7621 10.6948 16.703 10.7067 16.648 10.7297C16.5929 10.7527 16.5429 10.7864 16.501 10.8288C16.458 10.8715 16.4239 10.9221 16.4007 10.978C16.3774 11.0338 16.3654 11.0938 16.3654 11.1543C16.3654 11.2148 16.3774 11.2747 16.4007 11.3305C16.4239 11.3864 16.458 11.4371 16.501 11.4797L17.546 12.5247H7.50849C6.96877 12.5247 6.45116 12.3103 6.06953 11.9286C5.68789 11.547 5.47349 11.0294 5.47349 10.4897C5.47349 9.94996 5.68789 9.43235 6.06953 9.05072C6.45116 8.66908 6.96877 8.45468 7.50849 8.45468H10.2585C10.6455 8.45468 11.0287 8.37845 11.3863 8.23034C11.7438 8.08224 12.0687 7.86516 12.3424 7.5915C12.6161 7.31783 12.8331 6.99295 12.9812 6.63539C13.1293 6.27784 13.2056 5.89461 13.2056 5.50759C13.2056 5.12058 13.1293 4.73735 12.9812 4.37979C12.8331 4.02224 12.6161 3.69735 12.3424 3.42369C12.0687 3.15003 11.7438 2.93295 11.3863 2.78484C11.0287 2.63674 10.6455 2.56051 10.2585 2.56051H5.42766C5.31407 2.00408 4.99793 1.50963 4.54051 1.17305C4.08309 0.836458 3.51699 0.681703 2.95196 0.738783C2.38692 0.795863 1.86321 1.06071 1.48235 1.48198C1.10149 1.90325 0.890625 2.45093 0.890625 3.01884C0.890625 3.58675 1.10149 4.13444 1.48235 4.55571C1.86321 4.97698 2.38692 5.24183 2.95196 5.29891C3.51699 5.35599 4.08309 5.20123 4.54051 4.86464C4.99793 4.52805 5.31407 4.03361 5.42766 3.47718H10.2585C10.797 3.47718 11.3134 3.6911 11.6942 4.07187C12.075 4.45265 12.2889 4.96909 12.2889 5.50759C12.2889 6.04609 12.075 6.56254 11.6942 6.94332C11.3134 7.32409 10.797 7.53801 10.2585 7.53801H7.50849C7.12087 7.53801 6.73705 7.61436 6.37894 7.76269C6.02082 7.91103 5.69543 8.12845 5.42135 8.40253C5.14726 8.67662 4.92984 9.00201 4.78151 9.36012C4.63317 9.71824 4.55682 10.1021 4.55682 10.4897C4.55682 10.8773 4.63317 11.2611 4.78151 11.6192C4.92984 11.9773 5.14726 12.3027 5.42135 12.5768C5.69543 12.8509 6.02082 13.0683 6.37894 13.2167C6.73705 13.365 7.12087 13.4413 7.50849 13.4413H17.5552L16.7302 14.2663C16.6477 14.3397 16.5743 14.4222 16.501 14.4955C16.458 14.5381 16.4239 14.5888 16.4007 14.6447C16.3774 14.7005 16.3654 14.7604 16.3654 14.8209C16.3654 14.8814 16.3774 14.9413 16.4007 14.9972C16.4239 15.053 16.458 15.1037 16.501 15.1463C16.5879 15.228 16.7026 15.2735 16.8218 15.2735C16.941 15.2735 17.0558 15.228 17.1427 15.1463L18.7468 13.5422L18.976 13.313C19.0189 13.2704 19.053 13.2197 19.0763 13.1639C19.0996 13.108 19.1116 13.0481 19.1116 12.9876C19.1116 12.9271 19.0996 12.8672 19.0763 12.8113C19.053 12.7555 19.0189 12.7048 18.976 12.6622ZM3.18182 4.39384C2.90987 4.39384 2.64403 4.3132 2.41791 4.16211C2.1918 4.01103 2.01556 3.79628 1.91149 3.54503C1.80742 3.29379 1.78019 3.01732 1.83324 2.7506C1.8863 2.48387 2.01725 2.23887 2.20955 2.04657C2.40185 1.85428 2.64685 1.72332 2.91357 1.67026C3.1803 1.61721 3.45677 1.64444 3.70801 1.74851C3.95926 1.85258 4.17401 2.02882 4.32509 2.25494C4.47618 2.48105 4.55682 2.7469 4.55682 3.01884C4.55682 3.38352 4.41196 3.73325 4.1541 3.99112C3.89623 4.24898 3.5465 4.39384 3.18182 4.39384Z" fill="#2DCB74"/>
                </svg>
                </div></a>`
                : `<h3>${parkinglot.name} (Location not available)</h3>`;

            parkinglotElement.innerHTML = `
                <div class="parkinglot-info" style="background-color: ${colorClass === 'green' ? '#2ecc71' : (colorClass === 'orange' ? '#f39c12' : '#CB2D2D')}">
                    <h2>${parkinglot.free}</h2>
                    <p>Freie Parkplätze</p>
                </div>
                <div class="parkinglot-distanz">
                    <h3>${parkinglot.name}</h3>
                    ${parkinglot.distance ? `<p>Distanz: ${parkinglot.distance.toFixed(2)} km</p>` : ''}
                </div>
                ${parkingLotNameHTML}
            `;
            parkinglotContainer.appendChild(parkinglotElement);
        });
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    function filterParkingLots() {
        const searchText = searchbar.value.toLowerCase();
        const filteredData = allData.filter(parkinglot =>
            parkinglot.name.toLowerCase().includes(searchText)
        );
        displayParkingLots(filteredData);
    }

    searchbar.addEventListener('input', filterParkingLots);
});
