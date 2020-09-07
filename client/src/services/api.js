import axios from 'axios';
import 'dotenv/config';

export default () => {
  return axios.create({
    // server-side url
    baseURL: process.env.SERVER
  });
};
