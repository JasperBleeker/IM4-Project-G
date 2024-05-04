document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API
    let validData; // Define validData in a scope accessible to other functions
    let bubbleChart; // Declare bubbleChart in a scope accessible to other functions
    let dataForSelectedHour; // Declare dataForSelectedHour in a scope accessible to other functions
    const datePicker = document.getElementById('datePicker');


    //set the date picker to the current date
    const today = new Date();
    const currentDate = today.getFullYear()+ '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0') ;
    datePicker.value = currentDate;
    
    
    // Function to process the raw data from the API
    function processData(data) {
        return data.map(item => {
            const { created, location, free, total, name } = item;
            const [date, time] = created.split(' ');
            //process time to get only the hour
            const [hour, minute, second] = time.split(':');
            let newTime = `${hour}`;
            //if first digit is 0, remove it
            if (newTime[0] === '0') {
                newTime = newTime.substring(1);
            }
            

            if (location) {
                const [latitude, longitude] = location.split(',');
    
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
            } else {
                return null;  // Or handle no-location scenario appropriately
            }
        }).filter(item => item !== null); // Filter out any null entries if location is missing
        
    }


    // Function to update the bubble chart based on selected date and hour
    // function updateChart(selectedDate, selectedHour) {
        function updateChart(selectedDate, selectedHour) {
            try {
                // console.log("Updating chart with date:", selectedDate, "and hour:", selectedHour);
        
                // Filter data based on selected date and hour
                dataForSelectedHour = validData.filter(lot => lot.date == selectedDate && lot.newTime == selectedHour);
                // console.log('Data for selected date and hour:', dataForSelectedHour);
        
                if (dataForSelectedHour.length == 0) {
                    // console.log('No data available for the selected date and hour.');
                    return; // Exit the function if no data is available
                }
        
                // Calculate min and max for latitude and longitude with a margin
                const longitudes = dataForSelectedHour.map(lot => lot.coordinates.longitude);
                const latitudes = dataForSelectedHour.map(lot => lot.coordinates.latitude);
                const minLongitude = Math.min(...longitudes) - 0.01;
                const maxLongitude = Math.max(...longitudes) + 0.01;
                const minLatitude = Math.min(...latitudes) - 0.01;
                const maxLatitude = Math.max(...latitudes) + 0.01;
        
                // Update chart with filtered data
                const updatedDatasets = [{
                    label: 'Parking Lots',
                    data: dataForSelectedHour.map(lot => {
                        return {
                            x: lot.coordinates.longitude,
                            y: lot.coordinates.latitude,
                            r: Math.sqrt(lot.free), // Radius based on the square root of 'free' spots
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
                bubbleChart.options.scales.x.min = minLongitude;
                bubbleChart.options.scales.x.max = maxLongitude;
                bubbleChart.options.scales.y.min = minLatitude;
                bubbleChart.options.scales.y.max = maxLatitude;
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
            // console.log('Valid Data:', validData);
            const ctx = document.getElementById('dotMap').getContext('2d');

            

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
                            
                                    return `${lot.name}: ${lot.free} free spots of ${lot.total} total`;
                                }
                            }
                        }
                    }
                }
            });

            // Add event listener to date picker
            datePicker.addEventListener('change', () => {
                const selectedDate = String(datePicker.value);
                const selectedHour = document.getElementById('myRange').value; // Get current value of slider
                updateChart(selectedDate, selectedHour);
                //Console log the selected date for debugging
                // console.log('Selected date:', selectedDate);
            });

            //Add event listener to slider
            const slider = document.getElementById('myRange');
            slider.addEventListener('input', () => {
                const selectedDate = String(datePicker.value); // Get current value of date picker
                const selectedHour = slider.value;
                updateChart(selectedDate, selectedHour);
                //Console log the selected hour for debugging
                // console.log('Selected hour:', selectedHour);
            });

            // Load initial chart data
            const initialDate = datePicker.value;
            const initialHour = slider.value;
            // console.log('Initial date:', initialDate);
            // console.log('Initial hour:', initialHour);
            updateChart(initialDate, initialHour);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
