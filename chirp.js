// When the form with ID 'addForm' is submitted, do the following:
document.getElementById('addForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Stop the form from submitting the usual way (refreshing the page)

    // Get the value from the input box with ID 'columnName'
    const columnName = document.getElementById('columnName').value;

    try {
        // Send the value to the server at '/data' using a POST request
        const response = await fetch('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Tell the server we're sending JSON data
            },
            body: JSON.stringify({ columnName }) // Send the column name as JSON
        });

        // If the server response is not OK (not 200-299 status code), throw an error
        if (!response.ok) {
            throw new Error('Failed to add data'); // Show an error message
        }
        // Show a success message to the user
        alert('Data added successfully');
        fetchData(); // Refresh the data shown on the page
    } catch (error) {
        // If there's an error, show it in the console and alert the user
        console.error('Error:', error);
        alert('Error adding data');
    }
});

// This function gets the data from the server and shows it on the page
async function fetchData() {
    try {
        // Get the data from the server at '/data'
        const response = await fetch('/data');
        const data = await response.json(); // Convert the response to JSON

        // Get the element with ID 'dataContainer' to display the data
        const dataContainer = document.getElementById('dataContainer');
        dataContainer.innerHTML = ''; // Clear any existing content

         // Go through each item in the data
        data.forEach(item => {
            const div = document.createElement('div'); // Create a new div element
            div.textContent = item.columnName; // Set the text of the div to the column name
            dataContainer.appendChild(div); // Add the new div to the container
        });
    } catch (error) {
        // If there's an error, show it in the console and alert the user
        console.error('Error:', error);
        alert('Failed to fetch data');
    }
}

// Run the fetchData function to get and show the data when the page loads
fetchData();