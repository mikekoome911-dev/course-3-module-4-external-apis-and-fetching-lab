// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const stateInput = document.querySelector('#state-input');
const fetchButton = document.querySelector('#fetch-alerts');
const alertsContainer = document.querySelector('#alerts-display');
const errorMessageDiv = document.querySelector('#error-message');

if (fetchButton) {
    fetchButton.addEventListener('click', function() {
        const userInput = stateInput.value;

        if (stateInput) {
            stateInput.value = '';
        }

        fetchWeatherAlerts(userInput);
    });
}

function fetchWeatherAlerts(stateCode) {

    if (!stateCode || stateCode.trim() === "") {
        displayError({ message: "State abbreviation cannot be empty"});
        return;
    }
    const cleanStateCode = stateCode.toUpperCase().trim();
    const fullUrl = weatherApi + cleanStateCode;

    return fetch(fullUrl)
        
    .then(function(response) {
        if (response.ok === false) {
            throw new Error("Could not find data for that state code.");
        }
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        clearError();
        displayAlerts(data);
    })
    .catch(function(error) {
        console.log(error.message);
        displayError(error);
    });
}

function displayAlerts(data) {
    if (alertsContainer) {
    alertsContainer.innerHTML = '';
    }
    
    const titleText = data.title || "Current watches,warnings,and adversories";
    const totalAlerts = data.features ? data.features.length : 0;

    const header = document.createElement('h3');
    header.textContent = titleText + ": " + totalAlerts;

    if (alertsContainer) {
    alertsContainer.appendChild(header);
    }

    const list = document.createElement('ul');

    if (data.features && data.features.length > 0) {
    data.features.forEach(function(feature) {
        const headLineText = feature.properties.headline;

        const listItem = document.createElement('li');
        listItem.textContent = headLineText;

        list.appendChild(listItem);
    });
} else {
    const noAlertItem = document.createElement('li');
    noAlertItem.textContent = "No active alerts found for this area.";
    list.appendChild(noAlertItem);
}
   if (alertsContainer) {
    alertsContainer.appendChild(list);
   }
}

function displayError(messageText) {
    if (errorMessageDiv) {
    errorMessageDiv.textContent = messageText;
    errorMessageDiv.classList.remove('hidden');
}
}

function clearError() {
    if (errorMessageDiv) {
    errorMessageDiv.textContent = '';
    errorMessageDiv.classList.add('hidden');
}
}

if (typeof module !== 'undefined' && typeof module.exports !=='undefined') {
    module.exports = {
        fetchWeatherAlerts,
        displayAlerts
    };
}