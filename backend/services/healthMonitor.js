const axios = require('axios');

class HealthMonitorService {
  constructor() {
    this.services = [
      { name: 'bimuv-api', url: 'http://localhost:3001', healthPath: '/health', subdomain: 'api.bitebimuv.org' },
      { name: 'bimuv-bot', url: 'http://localhost:3002', healthPath: '/health', subdomain: 'bot.bitebimuv.org' },
      { name: 'bimuv-wa', url: 'http://localhost:3003', healthPath: '/health', subdomain: 'wa.bitebimuv.org' },
      { name: 'whatsapp-google', url: 'http://localhost:3004', healthPath: '/health', subdomain: 'wa-google.bitebimuv.org' },
      { name: 'virtual-number', url: 'http://localhost:3005', healthPath: '/health', subdomain: 'virtual-number.bitebimuv.org' },
      { name: 'password-manager', url: 'http://localhost:3006', healthPath: '/health', subdomain: 'password.bitebimuv.org' },
      { name: 'pushbullet', url: 'http://localhost:3007', healthPath: '/health', subdomain: 'pushbullet.bitebimuv.org' },
      { name: 'n8n', url: 'http://localhost:5678', healthPath: '/healthz', subdomain: 'n8n.bitebimuv.org' },
      { name: 'orkestra', url: 'http://localhost:5000', healthPath: '/health', subdomain: 'orkestra.bitebimuv.org' }
    ];
  }

  async checkService(service) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${service.url}${service.healthPath}`, {
        timeout: 5000,
        validateStatus: () => true
      });
      const responseTime = Date.now() - startTime;

      return {
        name: service.name,
        subdomain: service.subdomain,
        status: response.status === 200 ? 'healthy' : 'unhealthy',
        statusCode: response.status,
        responseTime,
        data: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        name: service.name,
        subdomain: service.subdomain,
        status: 'down',
        statusCode: 0,
        responseTime: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkAllServices() {
    const checks = await Promise.all(
      this.services.map(service => this.checkService(service))
    );

    const summary = {
      total: checks.length,
      healthy: checks.filter(c => c.status === 'healthy').length,
      unhealthy: checks.filter(c => c.status === 'unhealthy').length,
      down: checks.filter(c => c.status === 'down').length,
      timestamp: new Date().toISOString()
    };

    return {
      summary,
      services: checks
    };
  }

  async getServiceMetrics(serviceName) {
    const service = this.services.find(s => s.name === serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const check = await this.checkService(service);

    // Try to get more detailed metrics
    try {
      const metricsResponse = await axios.get(`${service.url}/metrics`, {
        timeout: 5000
      });
      check.metrics = metricsResponse.data;
    } catch (error) {
      check.metrics = null;
    }

    return check;
  }

  async restartService(serviceName) {
    // This would require PM2 API or system commands
    // For now, return instruction
    return {
      service: serviceName,
      action: 'restart',
      command: `pm2 restart ${serviceName}`,
      note: 'Execute this command on the server'
    };
  }

  async getSystemStatus() {
    try {
      const os = require('os');
      return {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        uptime: os.uptime(),
        loadAverage: os.loadavg(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = new HealthMonitorService();
