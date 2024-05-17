document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php';
    let validData;
    let dataForSelectedHour;
    let circles = [];
    const datePicker = document.getElementById('datePicker');
    const slider = document.getElementById('myRange');
    const sliderNumber = document.getElementById('slider-number');

    const today = new Date();
    const currentDate = today.toISOString().slice(0, 10);
    datePicker.value = currentDate;
    datePicker.max = currentDate;

    function formatHour(hour) {
        const h = parseInt(hour, 10);
        const suffix = h < 12 ? 'AM' : 'PM';
        const displayHour = ((h + 11) % 12 + 1);
        return `${displayHour}:00 ${suffix}`;
    }

    sliderNumber.textContent = formatHour(slider.value);

    function processData(data) {
        return data.map(item => {
            const { created, location, free: originalFree, total, name } = item;
            if (!location || !created) return null;

            let free = originalFree;
            if (free > total) {
                free = total;
            } else if (free < 0) {
                free = 0;
            }

            const [latitude, longitude] = location.split(',');
            const [date, time] = created.split(' ');
            const [hour, minute, second] = time.split(':');
            let newTime = `${hour}`;
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

        }).filter(item => item !== null);
    }

    function updateMap(selectedDate, selectedHour) {
        circles.forEach(circle => circle.remove());
        circles = [];

        try {
            dataForSelectedHour = validData.filter(lot => lot.date === selectedDate && lot.newTime === selectedHour);
            dataForSelectedHour.forEach(lot => {
                const { coordinates, name, free, total } = lot;
                const { latitude, longitude } = coordinates;

                const occupiedPercentage = ((total - free) / total) * 100;
                const radius = calculateCircleRadius(occupiedPercentage);

                const tooltipContent = `
                    <b>${name}</b><br>
                    Free Spaces: <b>${free}</b><br>
                    Total Spaces: <b>${total}</b><br>
                    Utilization: <b>${occupiedPercentage.toFixed(2)}%</b>
                `;

                const circle = L.circle([latitude, longitude], {
                    color: '#2DCB74',
                    fillColor: '#2DCB74',
                    fillOpacity: 0.8,
                    radius: radius
                }).addTo(map);

                circle.bindPopup(tooltipContent);
                circles.push(circle);
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

    var map = L.map('map').setView([47.386, 8.542], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            validData = processData(data);

            datePicker.addEventListener('change', () => {
                const selectedDate = datePicker.value;
                const selectedHour = slider.value;
                sliderNumber.textContent = formatHour(selectedHour);
                updateMap(selectedDate, selectedHour);
            });

            slider.addEventListener('input', () => {
                const selectedDate = datePicker.value;
                const selectedHour = slider.value;
                sliderNumber.textContent = formatHour(selectedHour);
                updateMap(selectedDate, selectedHour);
            });

            const initialDate = datePicker.value;
            const initialHour = slider.value;
            updateMap(initialDate, initialHour);

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
