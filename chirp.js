document.getElementById('addForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const columnName = document.getElementById('columnName').value;

    try {
        const response = await fetch('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ columnName })
        });

        if (!response.ok) {
            throw new Error('Failed to add data');
        }

        alert('Data added successfully');
        fetchData(); 
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding data');
    }
});


async function fetchData() {
    try {
        const response = await fetch('/data');
        const data = await response.json();

       
        const dataContainer = document.getElementById('dataContainer');
        dataContainer.innerHTML = ''; 

        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.columnName; 
            dataContainer.appendChild(div);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch data');
    }
}


fetchData();