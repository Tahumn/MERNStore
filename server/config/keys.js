const path = require('path');
const dotenv = require('dotenv');

// Load default .env (if process started in repo root)
dotenv.config();

const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');

// Load repo-level env first, then override with server/.env when present
dotenv.config({ path: rootEnvPath, override: false });
dotenv.config({ path: serverEnvPath, override: true });

const getEnv = (key, fallback = undefined) => {
  const value = process.env[key];

  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const normalisePath = value => value.replace(/^\/+/, '').replace(/\/+$/, '');
const normaliseUrl = value => value.replace(/\/+$/, '');

const appName = getEnv('APP_NAME', 'Mern Ecommerce');
const apiPath = normalisePath(getEnv('BASE_API_URL', 'api'));
const clientURL = normaliseUrl(getEnv('CLIENT_URL', 'http://localhost:8081'));
const defaultDbUri =
  'mongodb+srv://mernuser:ms123@cluster0.okuvv1t.mongodb.net/mernstore?retryWrites=true&w=majority&appName=Cluster0';

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  app: {
    name: appName,
    apiURL: apiPath,
    clientURL
  },
  port: toInt(getEnv('PORT'), 3000),
  database: {
    url: getEnv('MONGO_URI', defaultDbUri)
  },
  jwt: {
    secret: getEnv('JWT_SECRET', 'secret_key_123'),
    tokenLife: getEnv('JWT_TOKEN_LIFE', '7d')
  },
  mailchimp: {
    key: getEnv('MAILCHIMP_KEY', null),
    listKey: getEnv('MAILCHIMP_LIST_KEY', null)
  },
  mailgun: {
    key: getEnv('MAILGUN_KEY', null),
    domain: getEnv('MAILGUN_DOMAIN', null),
    sender: getEnv('MAILGUN_EMAIL_SENDER', null),
    host: getEnv('MAILGUN_HOST', 'api.mailgun.net')
  },
  smtp: {
    host: getEnv('SMTP_HOST', null),
    port: toInt(getEnv('SMTP_PORT'), 587),
    user: getEnv('SMTP_USER', null),
    pass: getEnv('SMTP_PASS', null),
    sender: getEnv('SMTP_EMAIL_SENDER', getEnv('SMTP_USER', null)),
    secure: getEnv('SMTP_SECURE', 'false').toLowerCase() === 'true'
  },
  google: {
    clientID: getEnv('GOOGLE_CLIENT_ID', null),
    clientSecret: getEnv('GOOGLE_CLIENT_SECRET', null),
    callbackURL: getEnv('GOOGLE_CALLBACK_URL', null)
  },
  facebook: {
    clientID: getEnv('FACEBOOK_CLIENT_ID', null),
    clientSecret: getEnv('FACEBOOK_CLIENT_SECRET', null),
    callbackURL: getEnv('FACEBOOK_CALLBACK_URL', null)
  },
  aws: {
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID', null),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY', null),
    region: getEnv('AWS_REGION', null),
    bucketName: getEnv('AWS_BUCKET_NAME', null)
  }
};
