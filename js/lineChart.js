document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API

    // Fetch the data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('lineChart').getContext('2d');

            // Calculate percentage of used spots and prepare datasets
            const datasets = [{
                label: 'Parking Lot Utilization',
                data: data.map(lot => {
                    const used = lot.total - lot.free; // Calculate used spots
                    const percentageUsed = (used / lot.total) * 100; // Calculate percentage
                    return {
                        x: lot.timestamp,
                        y: percentageUsed.toFixed(2) // Use toFixed(2) to limit to two decimal places
                    };
                }),
            }];

            // Create the line chart inside the then() to ensure data is loaded
            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: datasets
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Zeit'
                            },
                            beginAtZero: false
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Auslastung in %'
                            },
                            beginAtZero: true,
                            suggestedMax: 100  // Assuming percentage can't go beyond 100%
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
