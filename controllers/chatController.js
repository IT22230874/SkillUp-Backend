const { getChatGPTResponse } = require('../utils/openai');

exports.chatWithGPT = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const gptResponse = await getChatGPTResponse(message);
    res.json({ response: gptResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get response from ChatGPT' });
  }
};
