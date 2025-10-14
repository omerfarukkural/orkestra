const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class PushbulletService {
  constructor() {
    this.accessToken = 'o.7eLl0y0Oup3ILBgw0zpe4CGgpZU19KUa';
    this.baseURL = 'https://api.pushbullet.com/v2';
  }

  async getDevices() {
    try {
      const response = await axios.get(`${this.baseURL}/devices`, {
        headers: {
          'Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Pushbullet getDevices error:', error.message);
      throw error;
    }
  }

  async getUserInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/users/me`, {
        headers: {
          'Access-Token': this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Pushbullet getUserInfo error:', error.message);
      throw error;
    }
  }

  async sendPush(data) {
    try {
      const response = await axios.post(`${this.baseURL}/pushes`, data, {
        headers: {
          'Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Pushbullet sendPush error:', error.message);
      throw error;
    }
  }

  async sendNote(title, body, deviceIden = null) {
    const data = {
      type: 'note',
      title: title,
      body: body
    };

    if (deviceIden) {
      data.device_iden = deviceIden;
    }

    return await this.sendPush(data);
  }

  async sendLink(title, url, body = '', deviceIden = null) {
    const data = {
      type: 'link',
      title: title,
      url: url,
      body: body
    };

    if (deviceIden) {
      data.device_iden = deviceIden;
    }

    return await this.sendPush(data);
  }

  async uploadFile(filePath) {
    try {
      // Step 1: Request upload URL
      const fileName = filePath.split('/').pop();
      const fileStats = fs.statSync(filePath);

      const uploadRequest = await axios.post(
        `${this.baseURL}/upload-request`,
        {
          file_name: fileName,
          file_type: this.getMimeType(fileName)
        },
        {
          headers: {
            'Access-Token': this.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      const { upload_url, file_name, file_type, file_url } = uploadRequest.data;

      // Step 2: Upload file to the URL
      const fileBuffer = fs.readFileSync(filePath);

      await axios.post(upload_url, fileBuffer, {
        headers: {
          'Content-Type': file_type
        }
      });

      return {
        file_name,
        file_type,
        file_url,
        file_size: fileStats.size
      };
    } catch (error) {
      console.error('Pushbullet uploadFile error:', error.message);
      throw error;
    }
  }

  async sendFile(filePath, title = '', body = '', deviceIden = null) {
    try {
      // Upload file first
      const fileInfo = await this.uploadFile(filePath);

      // Send file push
      const data = {
        type: 'file',
        file_name: fileInfo.file_name,
        file_type: fileInfo.file_type,
        file_url: fileInfo.file_url,
        title: title || fileInfo.file_name,
        body: body
      };

      if (deviceIden) {
        data.device_iden = deviceIden;
      }

      return await this.sendPush(data);
    } catch (error) {
      console.error('Pushbullet sendFile error:', error.message);
      throw error;
    }
  }

  async getPushes(limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/pushes`, {
        params: {
          limit: limit,
          active: true
        },
        headers: {
          'Access-Token': this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Pushbullet getPushes error:', error.message);
      throw error;
    }
  }

  async deletePush(pushIden) {
    try {
      const response = await axios.delete(`${this.baseURL}/pushes/${pushIden}`, {
        headers: {
          'Access-Token': this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Pushbullet deletePush error:', error.message);
      throw error;
    }
  }

  getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'txt': 'text/plain',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'json': 'application/json',
      'xml': 'application/xml',
      'apk': 'application/vnd.android.package-archive'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  async sendOrkestraFile(deviceIden = null, fileType = 'apk') {
    const files = {
      apk: {
        path: '/Users/omerfarukkural/orkestra/android/app/build/outputs/apk/release/app-release.apk',
        title: 'Orkestra Android App',
        body: 'Orkestra uygulaması - telefonunuza yükleyin'
      },
      macos: {
        path: '/Users/omerfarukkural/orkestra/macos/.build/release/Orkestra',
        title: 'Orkestra macOS App',
        body: 'Orkestra macOS uygulaması'
      }
    };

    const file = files[fileType];
    if (!file || !fs.existsSync(file.path)) {
      throw new Error(`File not found: ${file.path}`);
    }

    return await this.sendFile(file.path, file.title, file.body, deviceIden);
  }
}

module.exports = new PushbulletService();
