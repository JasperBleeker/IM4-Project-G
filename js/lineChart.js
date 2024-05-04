//warten bis das Dokument geladen ist
document.addEventListener('DOMContentLoaded', () => {

    // API-URL
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php';

    // Deklarierung der Variablen
    let lineChart;
    let checkedLocations = [];

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
            });
        });
    }
    

    // Initialisierung des Charts
    function initializeChart(data) {

        const ctx = document.getElementById('lineChart').getContext('2d');

        const filteredData = data.filter(parking => parking.name === 'Uni Irchel');

        // console.log('Filtered data:', filteredData);  // Check the filtered data

        const ParkingData = filteredData.map(lot => (Math.round((lot.total - lot.free) / lot.total * 100)));

        // console.log('Dataset:', ParkingData);  // Check the processed dataset

        const datalabels = filteredData.map(lot => new Date(lot.created));

        // console.log('Data labels:', datalabels);  // Check the processed data labels

        lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datalabels,
                datasets: [{
                    label: 'Parking lot utilization %',
                    data: ParkingData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
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
                    text: 'Time'
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
                        const lot = context.dataset.data[context.dataIndex];
                        return `${lot.name}: ${lot.total - lot.free} used spots of ${lot.total} total (${context.raw.y}%)`;
                    }
                }
            }
        }
    };




});




