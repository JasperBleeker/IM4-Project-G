document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API
    let validData; // Define validData in a scope accessible to other functions
    let bubbleChart; // Declare bubbleChart in a scope accessible to other functions

    // Function to process the raw data from the API
    function processData(data) {
        return data.map(item => {
            const { created, location, free, total } = item;
            const [date, time] = created.split(' ');

            if (location) {
                const [latitude, longitude] = location.split(',');
                return {
                    date,
                    time,
                    coordinates: {
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude)
                    },
                    free,
                    total
                };
            } else {
                return null;  // Or handle no-location scenario appropriately
            }
        }).filter(item => item !== null); // Filter out any null entries if location is missing
    }


    // Function to update the bubble chart based on selected date and hour
    function updateChart(selectedDate, selectedHour) {
        try {
            console.log("Updating chart with date:", selectedDate, "and hour:", selectedHour);
    
            // Filter data based on selected date
            const dataForSelectedDate = validData.filter(lot => lot.date === selectedDate && lot.time.startsWith(selectedHour));

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
    
            console.log("Chart updated successfully.");
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }
    

    // Fetch the data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            validData = processData(data); // Process the raw data
            
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
                //Console log the selected date for debugging
                console.log('Selected date:', selectedDate);
            });

            //Add event listener to slider
            const slider = document.getElementById('myRange');
            slider.addEventListener('input', () => {
                const selectedDate = datePicker.value; // Get current value of date picker
                const selectedHour = slider.value;
                updateChart(selectedDate, selectedHour);
                //Console log the selected hour for debugging
                console.log('Selected hour:', selectedHour);
            });

            // Load initial chart data
            const initialDate = datePicker.value;
            const initialHour = slider.value;
            console.log('Initial date:', initialDate);
            console.log('Initial hour:', initialHour);
            updateChart(initialDate, initialHour);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
