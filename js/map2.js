document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API
    let validData; // Define validData in a scope accessible to other functions
    let dataForSelectedHour; // Declare dataForSelectedHour in a scope accessible to other functions
    let circles = []; // Declare circles in a scope accessible to other functions
    const datePicker = document.getElementById('datePicker');
    const slider = document.getElementById('myRange');
    const sliderNumber = document.getElementById('slider-number');
    

    //set the date picker to the current date
    const today = new Date();
    const currentDate = today.toISOString().slice(0, 10);
    datePicker.value = currentDate;
    datePicker.max = currentDate;

    // Function to format hour for display
    function formatHour(hour) {
        const h = parseInt(hour, 10);
        const suffix = h < 12 ? 'AM' : 'PM';
        const displayHour = ((h + 11) % 12 + 1);
        return `${displayHour}:00 ${suffix}`;
    }

    // Initial display update for the slider
    sliderNumber.textContent = formatHour(slider.value);


    // Function to process the raw data from the API
    function processData(data) {
        return data.map(item => {
            const { created, location, free, total, name } = item;
            if (!location || !created) return null;
            const [latitude, longitude] = location.split(',');

            const [date, time] = created.split(' ');
            //process time to get only the hour
            const [hour, minute, second] = time.split(':');
            let newTime = `${hour}`;
            //if first digit is 0, remove it
            if (newTime[0] === '0') {
                newTime = newTime.substring(1);
            }
            
            return {
                    date,
                    name,
                    newTime,
                    coordinates: {
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude)
                    },
                    free,
                    total
                };
            
        }).filter(item => item !== null); // Filter out any null entries if location is missing
        
    }

    // Function to update the Map based on selected date and hour
    function updateMap(selectedDate, selectedHour) {
        // Clear existing circles
        circles.forEach(circle => circle.remove());
        circles = [];  // Reset the circle array

        try {
            dataForSelectedHour = validData.filter(lot => lot.date === selectedDate && lot.newTime === selectedHour);

            dataForSelectedHour.forEach(lot => {
                const { coordinates, name, free, total } = lot;
                const { latitude, longitude } = coordinates;
                
                // Calculate the percentage of occupied spaces
                const occupiedPercentage = ((total - free) / total) * 100;
                
                const radius = calculateCircleRadius(occupiedPercentage);

                const circle = L.circle([latitude, longitude], {
                    color: '#2DCB74',
                    fillColor: '#2DCB74',
                    fillOpacity: 0.8,
                    radius: radius // Use dynamic radius based on occupancy
                }).addTo(map);

                // Update the popup to include utilization percentage
                circle.bindPopup(`<b>${name}</b><br>Free: ${free}<br>Total: ${total}<br>Utilization: ${occupiedPercentage.toFixed(2)}%`);
                circles.push(circle);  // Correctly keep track of circles
            });
        } catch (error) {
            console.error('Error updating map:', error);
        }
    }

    function calculateCircleRadius(occupiedPercentage) {
        const baseRadius = 50;
        const maxRadius = 300;
        return baseRadius + (occupiedPercentage / 100) * (maxRadius - baseRadius);
    }
    

    // Leafelt map
    var map = L.map('map').setView([47.386, 8.542], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            validData = processData(data); //Process the raw data

            // Add event listener for date picker
            datePicker.addEventListener('change', event => {
                const selectedDate = String(datePicker.value);
                const selectedHour = document.getElementById('myRange').value; //Get current value of the range slider
                sliderNumber.textContent = formatHour(selectedHour); // Update the slider number on date change

                updateMap(selectedDate, selectedHour);
            });
            
            //Add event listener to slider
            const slider = document.getElementById('myRange');
            slider.addEventListener('input', () => {
                const selectedDate = String(datePicker.value); // Get current value of date picker
                const selectedHour = slider.value;
                sliderNumber.textContent = formatHour(selectedHour); // Update the slider number on date change

                updateMap(selectedDate, selectedHour);
            });

            // Load initial chart data
            const initialDate = datePicker.value;
            const initialHour = slider.value;
            updateMap(initialDate, initialHour);
            
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

});
