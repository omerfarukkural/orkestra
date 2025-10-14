const express = require('express');
const router = express.Router();
const hetznerService = require('../services/hetznerService');
const cpanelService = require('../services/cpanelService');

// Hetzner Server Management
router.get('/hetzner/servers', async (req, res) => {
  try {
    const servers = await hetznerService.getServerStatus();
    res.json({ servers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hetzner/servers/:id/reboot', async (req, res) => {
  try {
    const action = await hetznerService.rebootServer(req.params.id);
    res.json({ action });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hetzner/servers/:id/poweron', async (req, res) => {
  try {
    const action = await hetznerService.powerOnServer(req.params.id);
    res.json({ action });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hetzner/servers/:id/poweroff', async (req, res) => {
  try {
    const action = await hetznerService.powerOffServer(req.params.id);
    res.json({ action });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// cPanel Management
router.get('/cpanel/info', async (req, res) => {
  try {
    const info = await cpanelService.getAccountInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/cpanel/subdomains', async (req, res) => {
  try {
    const subdomains = await cpanelService.listSubdomains();
    res.json(subdomains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cpanel/subdomains', async (req, res) => {
  try {
    const { domain, rootdomain, dir } = req.body;
    const result = await cpanelService.createSubdomain(domain, rootdomain, dir);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/cpanel/subdomains/:domain', async (req, res) => {
  try {
    const result = await cpanelService.deleteSubdomain(req.params.domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cpanel/ssl/:domain', async (req, res) => {
  try {
    const result = await cpanelService.installSSL(req.params.domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Combined infrastructure overview
router.get('/overview', async (req, res) => {
  try {
    const [hetznerServers, cpanelInfo] = await Promise.all([
      hetznerService.getServerStatus().catch(err => ({ error: err.message })),
      cpanelService.getAccountInfo().catch(err => ({ error: err.message }))
    ]);

    res.json({
      hetzner: hetznerServers,
      cpanel: cpanelInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
