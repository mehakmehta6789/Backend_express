document.getElementById('conceptualizeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect form data
    let eventPurpose = document.getElementById('eventPurpose').value;
    let guests = document.getElementById('guests').value;
    let date = document.getElementById('date').value;
    let budget = document.getElementById('budget').value;
    let theme = document.getElementById('theme').value;
    let venue = document.getElementById('venue').value;
    let foodBeverage = document.getElementById('foodBeverage').value;
    
    // Collect checkbox values
    let entertainment = [];
    document.querySelectorAll('input[name="entertainment"]:checked').forEach(function(e) {
        entertainment.push(e.value);
    });

    let decorations = document.getElementById('decorations').value;

    // Check if all fields are filled
    if (!eventPurpose || !guests || !date || !budget || !theme || !venue || !foodBeverage || !decorations || entertainment.length === 0) {
        alert('All fields are required. Please fill out every field before submitting.');
        return; // Prevent form submission
    }

    // Check if guests and budget are valid
    if (isNaN(guests) || guests <= 0) {
        alert('Invalid number of guests. Please enter a positive number.');
        return; // Prevent form submission
    }

    if (isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
        alert('Invalid budget. Please enter a valid number.');
        return; // Prevent form submission
    }

    // Create JSON object for backend
    let eventData = {
        eventPurpose,
        guests,
        date,
        budget,
        theme,
        venue,
        foodBeverage,
        entertainment,
        decorations
    };

    // Display form data on page
    let formDataHtml = `
        <h2>Your Event Details:</h2>
        <p><strong>Event Purpose:</strong> ${eventPurpose}</p>
        <p><strong>Number of Guests:</strong> ${guests}</p>
        <p><strong>Preferred Date(s):</strong> ${date}</p>
        <p><strong>Estimated Budget:</strong> ${budget}</p>
        <p><strong>Theme or Style:</strong> ${theme}</p>
        <p><strong>Venue Preferences:</strong> ${venue}</p>
        <p><strong>Food and Beverage:</strong> ${foodBeverage}</p>
        <p><strong>Entertainment:</strong> ${entertainment.join(', ')}</p>
        <p><strong>Decorations:</strong> ${decorations}</p>
    `;

    document.getElementById('formData').innerHTML = formDataHtml;

    // Send Data to Server for Saving in `data.json`
    try {
        const response = await fetch('/formdata', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData)
        });

        const result = await response.text();
        console.log(result);
        alert("Data Saved Successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error saving data!");
    }
});
