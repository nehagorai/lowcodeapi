require('dotenv').config();

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const lodash = require('lodash');
const moment = require('moment');

lodash.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
};

const envTemplate = `
RATE_LIMIT_WINDOW_IN_MS=60000
RATE_LIMIT_MAX_REQUEST=2

PROTOCOL={{PROTOCOL}}
REDIS_HOST=localhost
REDIS_PORT=6379
SESSION_STORE_IN_REDIS="YES"

DB_TYPE=mysql

DB_HOST=localhost
DB_PORT=3306
DB_NAME=lowcodeapi
DB_USER=lowcodeapi
DB_PASS=lowcodeapi

PORT={{PORT}}
APP_DOMAIN={{APP_DOMAIN}}
API_ENDPOINT={{APP_DOMAIN}}
UI_DOMAIN=localhost:3000
MOUNT_POINT=/api/v1
AUTH_MOUNT_POINT=/auth

#Keep BASE_PATH empty
BASE_PATH=

JWT_EXPIRES=7d
SESSION_EXPIRY=8640000
CACHE_ENABLED=1
CAHCE_KEY_EXPIRY_VALUE=30
ENCRYPTION_KEY={{ENCRYPTION_KEY}}
JWT_SECRET={{JWT_SECRET}}
SESSION_SECRET_KEY={{SESSION_SECRET_KEY}}

# Required for Google login
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Generated on ${moment().format('YYYY-MM-DD HH:mm:ss')}
`;

const envTemplateUI = `
DATA_ENDPOINT=http://localhost:3456
API_URL=http://localhost:3456
NAME=LowCodeAPI

# Generated on ${moment().format('YYYY-MM-DD HH:mm:ss')}
`;
function genToken(num) {
  return crypto.randomBytes(num || 16).toString('hex');
}

const prepare = async () => {
  try {
    fs.cpSync('.env', `.env.bkp-${moment().format('YYYY-MM-DD-HH-mm-ss')}`);
    fs.rmSync('.env');
  } catch (e) {
    console.log(e);
  }

  try {
    fs.cpSync(path.resolve('../', 'ui', '.env'), path.resolve('../', 'ui', `.env.bkp-${moment().format('YYYY-MM-DD-HH-mm-ss')}`));
    fs.rmSync(path.resolve('../', 'ui', '.env'));
  } catch (e) {
    console.log(e);
  }

  const {
    PROTOCOL = 'http',
    PORT = 3456,
    APP_DOMAIN,
  } = process.env;

  const templObj = {
    PROTOCOL,
    PORT,
    APP_DOMAIN: APP_DOMAIN || `localhost:${PORT}`,
    ENCRYPTION_KEY: genToken(44),
    JWT_SECRET: genToken(29),
    SESSION_SECRET_KEY: genToken(21),
  };
  const envFile = lodash.template(envTemplate)(templObj);
  fs.writeFileSync('.env', envFile, 'utf8');

  const envFileUI = lodash.template(envTemplateUI)({});
  fs.writeFileSync(path.resolve('../', 'ui', '.env'), envFileUI, 'utf8');
};

(async () => {
  await prepare();
  console.log('.env created');
  console.log('Now run,');
  console.log('`EMAIL= PASSWORD= FIRST_NAME= LAST_NAME= npm run create`');
  console.log('to create user, email and password will be used for login in the UI');
  process.exit();
})();
