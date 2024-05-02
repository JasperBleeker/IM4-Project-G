document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API

    // Fetch the data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('dotMap').getContext('2d');

            // Filter out any entries that do not have a valid location
            const validData = data.filter(lot => lot.location && lot.location.includes(','));

            // Group data by parking lot ID and keep only the latest timestamp for each parking lot
            const latestData = validData.reduce((acc, lot) => {
                if (!acc[lot.id] || new Date(lot.created) > new Date(acc[lot.id].created)) {
                    acc[lot.id] = lot;
                }
                return acc;
            }, {});
            console.log(latestData);

            const datasets = [{
                label: 'Parking Lots',
                data: validData.map(lot => {
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
            

            // Create the bubble chart
            new Chart(ctx, {
                type: 'bubble',
                data: {
                    datasets: datasets
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
