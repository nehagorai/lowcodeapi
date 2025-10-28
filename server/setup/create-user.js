require('dotenv').config();

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Sequelize, QueryTypes } = require('sequelize');

const generate = (prefix, num = 6, type = 'r') => {
  const prefixLocal = (prefix || 'usr').toString().toLowerCase();
  const gen_id = crypto.randomBytes(num).toString('hex')
    .toString()
    .replace('-', 'lx')
    .replace('_', 'ly')
    .toUpperCase();

  return `${prefixLocal}_${type}${gen_id}`;
};

const bcryptSaltRounds = 10;
const createUser = async () => {
  const {
    EMAIL, FIRST_NAME = 'User', LAST_NAME, PASSWORD,
  } = process.env;
  if (!EMAIL || !PASSWORD) {
    console.log('Error, EMAIL= and PASSWORD= is required to create user.\n\n`EMAIL=<YOUR_EMAIL> PASSWORD=<YOUR_PASSWORD> node setup/create-user.js`\n');
    process.exit(1);
  }

  const connection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      dialect: process.env.DB_TYPE,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: process.env.SSL || false,
        },
      },
      pool: {
        max: 10,
        min: 2,
        acquire: 60000,
        idle: 30000,
      },
    },
  );

  const query1 = 'SELECT * from users where email=?;';

  const data = await connection.query(query1, {
    type: QueryTypes.SELECT,
    replacements: [EMAIL],
  });
  if (data && data.length) {
    console.log(`Account with an email ('${EMAIL}') aleady exist, use different email'\n`);
    process.exit();
  }

  const salt = await bcrypt.genSalt(bcryptSaltRounds);

  const password_hash = await bcrypt.hash(PASSWORD, salt);
  const ref_id = generate('fe_usr');
  const query = 'INSERT INTO users (ref_id, email, username, password_hash, first_name, last_name, created_at, updated_at) values (?, ?,?,?,?,?, ?, ?);';

  try {
    await connection.query(query, {
      type: QueryTypes.INSERT,
      replacements: [ref_id, EMAIL, EMAIL, password_hash, FIRST_NAME || '', LAST_NAME || '', new Date, new Date]
    });
    console.log(`\n\nNew account created with an email='${EMAIL}' and password='${PASSWORD}'\n\n`);
  } catch (e) {
    throw e;
  }
};

(async () => {
  await createUser();
  process.exit();
})();
