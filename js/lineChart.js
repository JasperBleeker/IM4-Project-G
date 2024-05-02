document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API

    // Fetch the data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('lineChart').getContext('2d');

            //Eventual filtering of data
            
            const datasets = [{
                label: 'Parking Lots',
                data: data.map(lot => {
                    return {
                        x: lot.timestamp,
                        y: lot.free
                    };
                }),
            }]
        });
    
    // Create the line chart
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
                        text: 'Time'
                    },
                    beginAtZero: false
                },
                y: {
                    title: {
                        display: true,
                        text: 'Free spots'
                    },
                    beginAtZero: false
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const lot = data[context.dataIndex];
                            return `${lot.name}: ${lot.free} free spots of ${lot.total} total`;
                        }
                    }
                }
            }
        }
    });
});