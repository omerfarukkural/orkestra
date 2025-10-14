const axios = require('axios');

class HetznerService {
  constructor() {
    this.apiToken = process.env.HETZNER_API_TOKEN || 'Jp7QioJbY6HcT9eqQEHt369J43w93QCH9kOtiuHW0pIEtHzC280xikyweoetmms4';
    this.baseURL = 'https://api.hetzner.cloud/v1';
  }

  async getServers() {
    try {
      const response = await axios.get(`${this.baseURL}/servers`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });
      return response.data.servers;
    } catch (error) {
      console.error('Hetzner getServers error:', error.message);
      throw error;
    }
  }

  async getServerMetrics(serverId) {
    try {
      const response = await axios.get(`${this.baseURL}/servers/${serverId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        },
        params: {
          type: 'cpu,disk,network',
          start: new Date(Date.now() - 3600000).toISOString(), // Last hour
          end: new Date().toISOString()
        }
      });
      return response.data.metrics;
    } catch (error) {
      console.error('Hetzner getServerMetrics error:', error.message);
      throw error;
    }
  }

  async getServerActions(serverId) {
    try {
      const response = await axios.get(`${this.baseURL}/servers/${serverId}/actions`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });
      return response.data.actions;
    } catch (error) {
      console.error('Hetzner getServerActions error:', error.message);
      throw error;
    }
  }

  async rebootServer(serverId) {
    try {
      const response = await axios.post(
        `${this.baseURL}/servers/${serverId}/actions/reboot`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );
      return response.data.action;
    } catch (error) {
      console.error('Hetzner rebootServer error:', error.message);
      throw error;
    }
  }

  async powerOnServer(serverId) {
    try {
      const response = await axios.post(
        `${this.baseURL}/servers/${serverId}/actions/poweron`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );
      return response.data.action;
    } catch (error) {
      console.error('Hetzner powerOnServer error:', error.message);
      throw error;
    }
  }

  async powerOffServer(serverId) {
    try {
      const response = await axios.post(
        `${this.baseURL}/servers/${serverId}/actions/poweroff`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );
      return response.data.action;
    } catch (error) {
      console.error('Hetzner powerOffServer error:', error.message);
      throw error;
    }
  }

  async getServerStatus() {
    try {
      const servers = await this.getServers();
      const serverData = [];

      for (const server of servers) {
        const metrics = await this.getServerMetrics(server.id).catch(() => null);

        serverData.push({
          id: server.id,
          name: server.name,
          status: server.status,
          serverType: server.server_type.name,
          location: server.datacenter.location.name,
          ipv4: server.public_net.ipv4.ip,
          ipv6: server.public_net.ipv6?.ip,
          created: server.created,
          metrics: metrics,
          cpu: server.server_type.cores,
          ram: server.server_type.memory,
          disk: server.server_type.disk
        });
      }

      return serverData;
    } catch (error) {
      console.error('Hetzner getServerStatus error:', error.message);
      throw error;
    }
  }
}

module.exports = new HetznerService();
