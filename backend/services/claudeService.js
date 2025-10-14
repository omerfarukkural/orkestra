const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

class ClaudeService {
  async generateCode(prompt, language = 'javascript') {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Generate ${language} code for: ${prompt}\n\nProvide only the code without explanations.`
        }]
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  async analyzeCode(code, question) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Code:\n\`\`\`\n${code}\n\`\`\`\n\nQuestion: ${question}`
        }]
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  async createAutomation(description) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3096,
        messages: [{
          role: 'user',
          content: `Create an automation workflow for: ${description}\n\nReturn a JSON structure with trigger and actions.`
        }]
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  async chat(messages) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: messages
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }
}

module.exports = new ClaudeService();
