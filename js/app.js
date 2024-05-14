document.addEventListener('DOMContentLoaded', function() {

    let apiUrl = 'https://api.parkendd.de/Zuerich'

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let parkings = data.parkings;
            let parkingList = document.getElementById('parking-list');
            parkings.forEach(parking => {
                let parkingItem = document.createElement('li');
                parkingItem.innerHTML = parking.name;
                parkingList.appendChild(parkingItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});