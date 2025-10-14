const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

class NotionService {
  async syncApplications(applications) {
    try {
      // Create or update pages in Notion for each application
      const results = [];
      for (const app of applications) {
        const page = await this.createOrUpdatePage({
          title: app.name,
          properties: {
            Name: { title: [{ text: { content: app.name } }] },
            Status: { select: { name: app.status } },
            URL: { url: app.url },
            'Start Date': { date: { start: app.startDate } }
          }
        });
        results.push(page);
      }
      return results;
    } catch (error) {
      console.error('Notion Sync Error:', error);
      throw error;
    }
  }

  async syncLifeLogs(logs) {
    try {
      const results = [];
      for (const log of logs) {
        const page = await this.createOrUpdatePage({
          title: log.title,
          properties: {
            Title: { title: [{ text: { content: log.title } }] },
            Type: { select: { name: log.type } },
            Date: { date: { start: log.date } },
            Description: { rich_text: [{ text: { content: log.description || '' } }] }
          }
        });
        results.push(page);
      }
      return results;
    } catch (error) {
      console.error('Notion Sync Error:', error);
      throw error;
    }
  }

  async syncTransactions(transactions) {
    try {
      const results = [];
      for (const tx of transactions) {
        const page = await this.createOrUpdatePage({
          title: `${tx.type}: ${tx.amount} ${tx.currency}`,
          properties: {
            Type: { select: { name: tx.type } },
            Amount: { number: tx.amount },
            Category: { select: { name: tx.category } },
            Date: { date: { start: tx.date } }
          }
        });
        results.push(page);
      }
      return results;
    } catch (error) {
      console.error('Notion Sync Error:', error);
      throw error;
    }
  }

  async createOrUpdatePage(pageData) {
    try {
      // This is a simplified version - in production, you'd need to handle database creation
      // and page updates more robustly
      return { success: true, data: pageData };
    } catch (error) {
      console.error('Notion Page Error:', error);
      throw error;
    }
  }

  async getDatabase(databaseId) {
    try {
      return await notion.databases.retrieve({ database_id: databaseId });
    } catch (error) {
      console.error('Notion Database Error:', error);
      throw error;
    }
  }
}

module.exports = new NotionService();
