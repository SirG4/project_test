const axios = require('axios');
require('dotenv').config();

const apiClient = axios.create({
  baseURL: process.env.JUDGE0_API_URL,
  headers: {
    [process.env.JUDGE0_API_AUTH_HEADER]: process.env.JUDGE0_API_AUTH_KEY,
    'Content-Type': 'application/json'
  }
});

module.exports = apiClient;
