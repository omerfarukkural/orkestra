const express = require('express');
const router = express.Router();
const claudeService = require('../services/claudeService');
const ollamaService = require('../services/ollamaService');

// Claude endpoints
router.post('/claude/generate-code', async (req, res) => {
  try {
    const { prompt, language } = req.body;
    const code = await claudeService.generateCode(prompt, language);
    res.json({ code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/claude/analyze', async (req, res) => {
  try {
    const { code, question } = req.body;
    const analysis = await claudeService.analyzeCode(code, question);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/claude/automation', async (req, res) => {
  try {
    const { description } = req.body;
    const automation = await claudeService.createAutomation(description);
    res.json({ automation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/claude/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await claudeService.chat(messages);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ollama endpoints
router.post('/ollama/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    const response = await ollamaService.generate(prompt, model);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ollama/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;
    const response = await ollamaService.chat(messages, model);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ollama/models', async (req, res) => {
  try {
    const models = await ollamaService.listModels();
    res.json({ models });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
