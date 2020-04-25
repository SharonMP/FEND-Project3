/* Global Variables */
const apiKey = '0fcd9c04181e436bd4d937942bd311dd';

// Create a new date instance dynamically with JS
let d = new Date();
// Add 1 to getMonth() since it starts from 0
let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

// Call openweathermap asynchronously to get weather data
const weatherData = async(url) => {
  const request = await fetch(url);

  try {
    const response = await request.json();

    return response;
  } catch(error) {
    console.log("Error: ", error);
  }
}

// Call local server to post the results
const postData = async(url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  try {
    const response = await response.json();

    return response;
  } catch(error) {
    console.log("Error: ", error);
  }
}

// Call local server to get the results and render on page
const updateUI = async() => {
  try {
    const request = await fetch('/all');
    const response = await request.json();

    document.getElementById('date').innerHTML = 'Date: ' + response.date;
    document.getElementById('temp').innerHTML = 'Temperature: ' + response.temperature + '&#176; F'; //renders the degree symbol
    document.getElementById('content').innerHTML = 'You feel: ' + response.userInput;
  } catch(error) {
    console.log("Error: ", error);
  }
}

// Button handler that chains a series of Promises (async calls) using `then`
function performAction(e) {
  let zip = document.getElementById('zip').value;
  let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=imperial`

  weatherData(url)
    .then(function(data) {
      let temperature = data.main.temp;
      let userInput = document.getElementById('feelings').value;
      postData('/add', {temperature: temperature, date: newDate, userInput: userInput});
    })
    .then(function() {
      return updateUI();
    });
}

document.getElementById('generate').addEventListener('click', performAction);
