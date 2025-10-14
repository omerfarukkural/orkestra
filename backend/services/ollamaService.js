const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = 'https://api.ollama.ai';
    this.apiKey = process.env.OLLAMA_API_KEY;
  }

  async generate(prompt, model = 'llama2') {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/generate`,
        {
          model: model,
          prompt: prompt,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.response;
    } catch (error) {
      console.error('Ollama API Error:', error.message);
      throw error;
    }
  }

  async chat(messages, model = 'llama2') {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/chat`,
        {
          model: model,
          messages: messages,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.message;
    } catch (error) {
      console.error('Ollama Chat Error:', error.message);
      throw error;
    }
  }

  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data.models;
    } catch (error) {
      console.error('Ollama Models Error:', error.message);
      throw error;
    }
  }
}

module.exports = new OllamaService();
