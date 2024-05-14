//warten bis das Dokument geladen ist
document.addEventListener('DOMContentLoaded', () => {

    // API-URL
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php';

    // Deklarierung der Variablen für alle Funktionen
    let lineChart;
    let checkedLocations = [];
    let allData = [];

    // Eventlistener für Start- und Enddatum
    document.getElementById('startDate').addEventListener('change', updateChartBasedOnDateAndLocation);
    document.getElementById('endDate').addEventListener('change', updateChartBasedOnDateAndLocation);

    // set the end date to the current date
    const today = new Date();
    const currentDate = today.toISOString().slice(0, 10);
    document.getElementById('endDate').value = currentDate;

    // set the max date to the current date
    document.getElementById('endDate').max = currentDate;
    document.getElementById('startDate').max = currentDate;

    

    // Funktion für Chart Farben
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }


    // Fetchen der Daten und Erstellen des Charts
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log('Data fetched:', data);  // Check the fetched data
            allData = data;
            createCheckbox(data);
            initializeChart(data);
        })
        .catch(error => {
            console.error('Error fetching data or processing chart:', error);
        });

    // Erstellen der Checkboxen
    function createCheckbox(data) {
        const locationContainer = document.getElementById('loop-box');
        const uniqueLocations = new Set();
        data.forEach(location => {
            if (!uniqueLocations.has(location.name)) {
                uniqueLocations.add(location.name);

                const checkboxContainer = document.createElement('div');
                checkboxContainer.classList.add('loop-check-div');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('locationCheckbox');
                checkbox.name = location.name;
                checkbox.id = location.name;

                const label = document.createElement('label');
                label.htmlFor = location.name;
                label.textContent = location.name;

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                locationContainer.appendChild(checkboxContainer);
            }
        });
        // Eventlistener für die Checkboxen
        attachEventListeners();
    }

    function attachEventListeners() {
        // Eventlistener für die Checkboxen
        // Vom User ausgewählte Standorte für die Anzeige im Chart
        let locationCheck = document.querySelectorAll('.locationCheckbox');

        locationCheck.forEach(location => {
            location.addEventListener('change', () => {
                checkedLocations = Array.from(locationCheck)
                    .filter(location => location.checked)
                    .map(location => location.name);

                console.log('Checked locations:', checkedLocations);
                updateChart(checkedLocations);
            });
        });
    }

    function updateChartBasedOnDateAndLocation() {
    let selectedLocations = Array.from(document.querySelectorAll('.locationCheckbox'))
                                 .filter(checkbox => checkbox.checked)
                                 .map(checkbox => checkbox.name);
    updateChart(selectedLocations);
}


    // Initialisierung des Charts
    function updateChart(selectedLocations) {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        endDate.setHours(23, 59, 59, 999); // Set the end date to the end of the day

        const datasets = []; // Array to store the datasets for each location

        selectedLocations.forEach(location => {
        const filteredData = allData.filter(item => {
            const itemDate = new Date(item.created);
            return item.name === location && itemDate >= startDate && itemDate <= endDate;
        });

        // Map the data for this location to the format required by the chart
        const dataPoints = filteredData.map(lot => ({
            x: new Date(lot.created),
            y: Math.round((lot.total - lot.free) / lot.total * 100) // Assuming lot.total is never 0 @ Jasper
        }));

        // Create the dataset for this location
        const dataset = {
            label: `${location} utilization %`,
            data: dataPoints,
            borderColor: getRandomColor(),
            fill: false,
            tension: 0.1
        };

        datasets.push(dataset);
    });

    const ctx = document.getElementById('lineChart').getContext('2d');
    if (lineChart) {
        lineChart.destroy(); // Destroy the previous chart before creating a new one
    }


        lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets
                
            },
            options: chartOptions  // Defined separately for clarity
        });
    }


    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        hour: 'MMM dd, HH'
                    },
                    tooltipFormat: 'MMM dd, yyyy HH'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                beginAtZero: true,
                suggestedMax: 100,
                title: {
                    display: true,
                    text: 'Utilization %'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label;
                        const value = context.raw.y;
                        return `${label}: ${value}%`;
                    }
                }
            }
        }
    };




});




