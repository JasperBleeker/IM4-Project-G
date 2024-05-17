(function() {
    let lineChart;
    let allData = [];
    let checkedLocations = [];

    // Generate a random color for the chart lines
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        hour: 'MMM dd, HH:mm'
                    },
                    tooltipFormat: 'MMM dd, yyyy HH:mm'
                },
                title: {
                    display: true,
                    text: 'Datum'
                }
            },
            y: {
                beginAtZero: true,
                suggestedMax: 100,
                title: {
                    display: true,
                    text: 'Auslastung (%)'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const dataset = context.dataset;
                        const value = context.raw.y;
                        const free = context.raw.free;
                        const total = context.raw.total;
                        return `${dataset.label}: ${value}% (${free} von ${total} frei)`;
                    }
                }
            }
        }
    };

    function updateChart(selectedLocations) {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        endDate.setHours(23, 59, 59, 999);

        const datasets = [];

        selectedLocations.forEach(location => {
            const filteredData = allData.filter(item => {
                const itemDate = new Date(item.created);
                return item.name === location && itemDate >= startDate && itemDate <= endDate;
            });

            const dataPoints = filteredData.map(lot => ({
                x: new Date(lot.created),
                y: Math.round((lot.total - lot.free) / lot.total * 100),
                free: lot.free,
                total: lot.total
            }));

            const dataset = {
                label: `${location} Auslastung`,
                data: dataPoints,
                borderColor: getRandomColor(),
                fill: false,
                tension: 0.1
            };

            datasets.push(dataset);
        });

        const ctx = document.getElementById('lineChart').getContext('2d');
        if (lineChart) {
            lineChart.destroy();
        }

        lineChart = new Chart(ctx, {
            type: 'line',
            data: { datasets: datasets },
            options: chartOptions
        });
    }

    function attachEventListeners() {
        let locationCheckboxes = document.querySelectorAll('.locationCheckbox');
        locationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                checkedLocations = checkedLocations.includes(checkbox.name) ?
                    checkedLocations.filter(name => name !== checkbox.name) : [...checkedLocations, checkbox.name];
                updateChart(checkedLocations);
            });
        });
    }

    // Initialize checkboxes from unique location names
    function initializeCheckboxes(data) {
        const locationContainer = document.getElementById('loop-box');
        locationContainer.innerHTML = ''; // Clear previous checkboxes, if any

        // Extract unique locations from data
        const uniqueLocations = [...new Set(data.map(item => item.name))];
        
        uniqueLocations.forEach(locationName => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.classList.add('loop-check-div');
            checkboxContainer.id = 'div-' + locationName;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('locationCheckbox');
            checkbox.name = locationName;
            checkbox.id = locationName;

            if (checkedLocations.includes(locationName)) {
                checkbox.checked = true;
            }

            const label = document.createElement('label');
            label.htmlFor = locationName;
            label.textContent = locationName;

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            locationContainer.appendChild(checkboxContainer);
        });

        attachEventListeners();
    }

    function filterParkingLots() {
        const searchbar = document.getElementById('search');
        const searchText = searchbar.value.toLowerCase();
        const locationCheckboxes = document.querySelectorAll('.loop-check-div');

        locationCheckboxes.forEach(div => {
            const checkbox = div.querySelector('input.locationCheckbox');
            if (searchText === '' || checkbox.name.toLowerCase().includes(searchText)) {
                div.style.display = ''; // Show the checkbox div
            } else {
                div.style.display = 'none'; // Hide the checkbox div
            }
        });
    }

        // Correct data where free is greater than total
    function correctData(data) {
        return data.map(item => {
            if (item.free > item.total) {
                return {...item, free: item.total};
            }
            return item;
        });
    }


    document.addEventListener('DOMContentLoaded', () => {
        const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php';

        const searchbar = document.getElementById('search');
        searchbar.addEventListener('input', filterParkingLots);

        document.getElementById('startDate').addEventListener('change', () => updateChart(checkedLocations));
        document.getElementById('endDate').addEventListener('change', () => updateChart(checkedLocations));

        const today = new Date();
        const currentDate = today.toISOString().slice(0, 10);
        document.getElementById('endDate').value = currentDate;
        document.getElementById('endDate').max = currentDate;
        document.getElementById('startDate').max = currentDate;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                allData = correctData(data); // Correct data where free is greater than total
                initializeCheckboxes(allData); // Create checkboxes with unique location names
                updateChart(checkedLocations); // Update chart with initially checked locations
            })
            .catch(error => {
                console.error('Error fetching data or processing chart:', error);
            });
    });
})();
