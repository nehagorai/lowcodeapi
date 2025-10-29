import 'dotenv/config';

const { IP_LOGGING = false } = process.env;
const {
  ENCRYPTION_KEY,
  APPLICATION_MODE,
  MICROSERVICE_ENABLED = false,
  CACHE_ENABLED,
  READ_MODE, GRACE_MODE,
} = process.env;

const {
  SESSION_EXPIRY = 8640000,
  SESSION_STORE_IN_REDIS,
  SESSION_SECRET_KEY,
} = process.env;

const { JWT_SECRET, JWT_EXPIRES = '7d' } = process.env;

const { CAHCE_KEY_EXPIRY_VALUE = 0 } = process.env;

const {
  INTERNAL_ACCESS_KEY,
  INTERNAL_ACCESS_KEYS,
} = process.env;

const {
  PROTOCOL = 'http',
  PORT,
  API_ENDPOINT,
  APP_DOMAIN,
  UI_DOMAIN,
  MOUNT_POINT = '/api/v1',
  AUTH_MOUNT_POINT = '/auth',
  BASE_PATH,
} = process.env;

const DB = {
  DB_TYPE: process.env.DB_TYPE || 'sqlite',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  SSL: process.env.SSL || false,
};

// RATE LIMIT

const { RATE_LIMIT_WINDOW_IN_MS, RATE_LIMIT_MAX_REQUEST } = process.env;

const RATE_LIMIT = {
  RATE_LIMIT_WINDOW_IN_MS: +RATE_LIMIT_WINDOW_IN_MS! || 900000,
  RATE_LIMIT_MAX_REQUEST: +RATE_LIMIT_MAX_REQUEST! || 100,
};

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

const GOOGLE = {
  AUTH: {
    GOOGLE: {
      CLIENT_ID: GOOGLE_CLIENT_ID,
      CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
      SCOPE: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    },
  },
};

const expo: { [key: string]: any } = {
  IP_LOGGING,
  APPLICATION_MODE,
  MICROSERVICE_ENABLED,
  CACHE_ENABLED,
  ENCRYPTION_KEY,
  READ_MODE,
  GRACE_MODE,

  INTERNAL_ACCESS_KEY,
  INTERNAL_ACCESS_KEYS,

  JWT_SECRET,
  JWT_EXPIRES,

  SESSION_EXPIRY,
  SESSION_STORE_IN_REDIS,
  SESSION_SECRET_KEY,

  DB,

  PROTOCOL,
  PORT,
  API_ENDPOINT,
  APP_DOMAIN,
  UI_DOMAIN,
  BASE_PATH,
  AUTH_MOUNT_POINT,
  MOUNT_POINT,

  CAHCE_KEY_EXPIRY_VALUE,
  RATE_LIMIT,

  OAUTH: {
    ...GOOGLE.AUTH,
  },
};

export default expo;
