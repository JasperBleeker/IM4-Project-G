document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API
    let validData; // Define validData in a scope accessible to other functions
    let bubbleChart; // Declare bubbleChart in a scope accessible to other functions

    // Function to update the bubble chart based on selected date and hour
    function updateChart(selectedDate, selectedHour) {
        // Filter data based on selected date
        const dataForSelectedDate = validData.filter(lot => lot.created.startsWith(selectedDate));

        // Further filter data based on selected hour
        const dataForSelectedHour = dataForSelectedDate.filter(lot => new Date(lot.created).getHours() === selectedHour);

        // Update chart with filtered data
        const updatedDatasets = [{
            label: 'Parking Lots',
            data: dataForSelectedHour.map(lot => {
                const [latitude, longitude] = lot.location.split(',').map(Number);
                return {
                    x: longitude,
                    y: latitude,
                    r: Math.sqrt(lot.free), // Use square root of 'free' spots as radius for visibility
                    name: lot.name,
                    free: lot.free,
                    total: lot.total
                };
            }),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }];

        // Update the chart data and redraw
        bubbleChart.data.datasets = updatedDatasets;
        bubbleChart.update();
    }

    // Fetch the data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('dotMap').getContext('2d');

            // Filter out any entries that do not have a valid location
            validData = data.filter(lot => lot.location && lot.location.includes(',')); // Assign to validData

            // Group data by parking lot ID and keep only the latest timestamp for each parking lot
            const latestData = validData.reduce((acc, lot) => {
                if (!acc[lot.id] || new Date(lot.created) > new Date(acc[lot.id].created)) {
                    acc[lot.id] = lot;
                }
                return acc;
            }, {});

            // Initial chart setup
            bubbleChart = new Chart(ctx, {
                type: 'bubble',
                data: {
                    datasets: [] // Initially empty until updated
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Longitude'
                            },
                            beginAtZero: false
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Latitude'
                            },
                            beginAtZero: false
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const lot = context.dataset.data[context.dataIndex];
                                    const latestLot = latestData[lot.id];
                                    return `${lot.name}: ${lot.free} free spots of ${lot.total} total`;
                                }
                            }
                        }
                    }
                }
            });

            // Add event listener to date picker
            const datePicker = document.getElementById('datemin');
            datePicker.addEventListener('change', () => {
                const selectedDate = datePicker.value;
                const selectedHour = document.getElementById('myRange').value; // Get current value of slider
                updateChart(selectedDate, selectedHour);
            });

            // Add event listener to slider
            const slider = document.getElementById('myRange');
            slider.addEventListener('input', () => {
                const selectedDate = datePicker.value; // Get current value of date picker
                const selectedHour = slider.value;
                updateChart(selectedDate, selectedHour);
            });

            // Load initial chart data
            const initialDate = datePicker.value;
            const initialHour = slider.value;
            updateChart(initialDate, initialHour);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
