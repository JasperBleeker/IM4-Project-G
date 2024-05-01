//wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    //URL of the API
    const apiUrl = 'https://api.parkendd.de/Zuerich';

    //fetch the data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            //output the data to the console
            console.log(data);

        })
        .catch(error => {
            console.error('Fehler beim Abrufen:', error);
        });
});
