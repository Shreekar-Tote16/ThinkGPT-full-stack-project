const fetch = require('node-fetch');

async function testSessions() {
  try {
    const res = await fetch('http://localhost:5000/api/sessions');
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Sessions:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSessions();
