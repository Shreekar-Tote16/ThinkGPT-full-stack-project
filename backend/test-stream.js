require('dotenv').config();

async function testStream() {
  try {
    const response = await fetch('http://localhost:5000/api/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Explain quantum entanglement simply',
        model: 'groq-fast'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          console.log('Received chunk:', json);
        } catch (e) {
          console.log('Raw line:', line);
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error.message);
  }
}

testStream();
