const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  githubOpenaiApiKey: process.env.GITHUB_OPENAI_API_KEY,
  githubOpenaiApiEndpoint: process.env.GITHUB_OPENAI_API_ENDPOINT,
  environment: process.env.NODE_ENV || 'development'
};