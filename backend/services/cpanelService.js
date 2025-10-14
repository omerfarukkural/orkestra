const axios = require('axios');

class CpanelService {
  constructor() {
    this.apiToken = process.env.CPANEL_API_TOKEN || '1XU3KEN6HU63ANBAHFVMI3X1SL9MB0AR';
    this.cpanelHost = 'https://turhost.com:2083'; // veya doğru cPanel URL'si
    this.username = 'bitebim2';
  }

  async executeAPI(module, func, params = {}) {
    try {
      const url = `${this.cpanelHost}/execute/${module}/${func}`;
      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `cpanel ${this.username}:${this.apiToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('cPanel API error:', error.message);
      throw error;
    }
  }

  async listSubdomains() {
    try {
      return await this.executeAPI('SubDomain', 'listsubdomains');
    } catch (error) {
      console.error('cPanel listSubdomains error:', error.message);
      throw error;
    }
  }

  async createSubdomain(domain, rootdomain, dir) {
    try {
      return await this.executeAPI('SubDomain', 'addsubdomain', {
        domain,
        rootdomain,
        dir
      });
    } catch (error) {
      console.error('cPanel createSubdomain error:', error.message);
      throw error;
    }
  }

  async deleteSubdomain(domain) {
    try {
      return await this.executeAPI('SubDomain', 'delsubdomain', {
        domain
      });
    } catch (error) {
      console.error('cPanel deleteSubdomain error:', error.message);
      throw error;
    }
  }

  async installSSL(domain) {
    try {
      return await this.executeAPI('SSL', 'install_ssl', {
        domain
      });
    } catch (error) {
      console.error('cPanel installSSL error:', error.message);
      throw error;
    }
  }

  async getDiskUsage() {
    try {
      return await this.executeAPI('Quota', 'get_quota_info');
    } catch (error) {
      console.error('cPanel getDiskUsage error:', error.message);
      throw error;
    }
  }

  async getBandwidthUsage() {
    try {
      return await this.executeAPI('Stats', 'get_bandwidth');
    } catch (error) {
      console.error('cPanel getBandwidthUsage error:', error.message);
      throw error;
    }
  }

  async listDatabases() {
    try {
      return await this.executeAPI('Mysql', 'list_databases');
    } catch (error) {
      console.error('cPanel listDatabases error:', error.message);
      throw error;
    }
  }

  async getAccountInfo() {
    try {
      const [quota, bandwidth, subdomains, databases] = await Promise.all([
        this.getDiskUsage().catch(() => null),
        this.getBandwidthUsage().catch(() => null),
        this.listSubdomains().catch(() => null),
        this.listDatabases().catch(() => null)
      ]);

      return {
        quota,
        bandwidth,
        subdomains: subdomains?.data || [],
        databases: databases?.data || [],
        username: this.username
      };
    } catch (error) {
      console.error('cPanel getAccountInfo error:', error.message);
      throw error;
    }
  }
}

module.exports = new CpanelService();
