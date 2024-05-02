document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php'; // URL to the API

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Debug: Output the data to the console.
            if (!data || !Array.isArray(data) || !data.length) {
                throw new Error("Data is empty or not in expected format");
            }

            const ctx = document.getElementById('lineChart').getContext('2d');
            const datasets = data.map(lot => {
                if (!lot.total && lot.total !== 0) {
                    console.error("Invalid data entries found", lot);
                    return null;
                }
                let value;
                if (lot.total === 0) {
                    value = lot.free; // Display free spots directly
                } else {
                    const used = lot.total - lot.free;
                    const percentageUsed = (used / lot.total) * 100;
                    value = percentageUsed.toFixed(2);
                }
                return {
                    x: new Date(lot.timestamp), // Ensure the timestamp is a Date object
                    y: value
                };
            }).filter(Boolean);
             // Filter out null values

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
                                unit: 'hour'
                            },
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Utilization in % (or count for edge cases)'
                            },
                            beginAtZero: true,
                            suggestedMax: 100
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const lot = data[context.dataIndex];
                                    const usedSpots = lot.total > 0 ? lot.total - lot.free : lot.free;
                                    const label = lot.total > 0 ? `${usedSpots} used spots of ${lot.total} total (${context.raw.y}%)` : `Edge case: ${lot.free} free spots (no total capacity)`;
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data or processing chart:', error);
        });
});
