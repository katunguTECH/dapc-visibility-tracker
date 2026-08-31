// test-api-key.js
const axios = require('axios');

const API_KEY = 'AIzaSyD-BY3elC33y7R9SOKEw-jpc2HpfF6pyhU';

async function testAPIKey() {
  try {
    // Test Geocoding API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Nairobi,Kenya&key=${API_KEY}`
    );
    
    if (response.data.status === 'OK') {
      console.log('✅ Geocoding API works!');
      console.log('Location:', response.data.results[0].formatted_address);
    } else {
      console.log('❌ Geocoding API error:', response.data.status);
      console.log('Error message:', response.data.error_message || 'No message');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPIKey();
