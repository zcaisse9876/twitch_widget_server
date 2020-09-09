import fs from 'fs';
import axios from 'axios';
const credfile = 'helix.json';
const authapi = 'https://id.twitch.tv/oauth2/token';
const validateapi = 'https://id.twitch.tv/oauth2/validate';

class HelixAuth {
  constructor() {
    this.clientID = process.env.CLIENTID;
    this.saved_token = undefined;
  }

  async oAuthToken() {
    try {
      let token = await this.initToken();
      if (!await this.validateToken(token)) token = await this.getToken();
      console.log(`Got auth token: ${token}`);
      this.saved_token = token;
      return Promise.resolve(token);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async initToken() {
    if (this.saved_token) return this.saved_token;
    if (fs.existsSync(credfile)) return this.readExistingToken();
    return await this.getToken();
  }

  async getToken() {
    const opts = {
      method: 'post',
      url: `${authapi}?client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&grant_type=client_credentials`
    };
    const { data } = await axios(opts);
    if (!data.access_token || !data.expires_in) throw new Error('Bad Access Token');
    this.saveToken(data);
    return data.access_token;
  }

  async validateToken(token) {
    const opts = {
      method: 'get',
      url: validateapi,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios(opts);
    return (data.client_id == process.env.CLIENTID && data.expires_in > 1000);
  }

  saveToken(token) {
    fs.writeFileSync(credfile, JSON.stringify(token));
  }

  readExistingToken() {
    const { access_token } = JSON.parse(fs.readFileSync(credfile, 'utf8'));
    return access_token;
  }
}

const helixAuth = new HelixAuth();
export default helixAuth;