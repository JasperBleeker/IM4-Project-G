document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://project-g.data.dynamicvisualscollective.ch/php/unload.php';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log('Data fetched:', data);  // Check the fetched data

            const ctx = document.getElementById('lineChart').getContext('2d');
            // const dataset = data.map(lot => {
            //     let yValue;
            //     if (lot.total === 0) {
            //         yValue = lot.free;
            //     } else {
            //         const used = lot.total - lot.free;
            //         const percentageUsed = (used / lot.total) * 100;
            //         yValue = percentageUsed.toFixed(2);
            //     }
            //     console.log('Processing lot:', lot);  // Log each lot being processed
            //     return {
            //         x: new Date(lot.created), // Parse the date string into a Date object
            //         y: parseFloat(yValue)
            //     };
            // });

            const filteredData = data.filter(parking => parking.name === 'Uni Irchel');

            // console.log('Filtered data:', filteredData);  // Check the filtered data

            const ParkingData = filteredData.map(lot => (Math.round((lot.total - lot.free) / lot.total * 100)));

            // console.log('Dataset:', ParkingData);  // Check the processed dataset

            const datalabels = filteredData.map(lot => new Date(lot.created));

            // console.log('Data labels:', datalabels);  // Check the processed data labels

            new Chart(ctx, {
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
        })
        .catch(error => {
            console.error('Error fetching data or processing chart:', error);
        });
});

const chartOptions = {
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'hour',
                displayFormats: {
                    hour: 'MMM dd, HH:mm'
                },
                tooltipFormat: 'MMM dd, yyyy HH:mm'
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
    }
    // ,
    // plugins: {
    //     tooltip: {
    //         callbacks: {
    //             label: function(context) {
    //                 const lot = data[context.dataIndex];
    //                 return `${lot.name}: ${lot.total - lot.free} used spots of ${lot.total} total (${context.raw.y}%)`;
    //             }
    //         }
    //     }
    // }
};
