const axios = require('axios');
require('dotenv').config();

async function getChatGPTResponse(message) {
  
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key is not defined in environment variables.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that ONLY provides information about available courses. Politely decline to answer any unrelated questions.' },
      { role: 'user', content: message },
    ],
    max_tokens: 300,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      data,
      {
        headers,
        timeout: 10000 
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API call failed:', error.response?.data || error.message);
    throw new Error('Failed to get response from OpenAI API.');
  }
}

module.exports = { getChatGPTResponse };
