document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('lineChart').getContext('2d');

        // Prepare the datasets
        const datasets = data.map(lot => {
            let yValue;
            if (lot.total === 0) {
                // Handle the edge case where total spots are 0
                yValue = lot.free; // Normally, this should also be 0
            } else {
                const used = lot.total - lot.free;
                const percentageUsed = (used / lot.total) * 100;
                yValue = percentageUsed.toFixed(2); // Convert to a percentage and fix to 2 decimal places
            }
            return {
                x: new Date(lot.timestamp), // Convert timestamp to a Date object
                y: parseFloat(yValue) // Ensure yValue is a number
            };
        });

        // Create the chart with the processed datasets
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Parking Lot Utilization',
                    data: datasets,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'  // Adjust based on the density of your timestamps
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Utilization in %'
                        },
                        beginAtZero: true,
                        suggestedMax: 100  // Only needed if displaying percentages
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const lot = data[context.dataIndex];
                                return `${lot.name}: ${lot.total - lot.free} used spots of ${lot.total} total (${context.raw.y}%)`;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

});
