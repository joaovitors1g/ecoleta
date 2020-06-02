// Update with your config settings.

import { config as configEnv } from 'dotenv';
import path from 'path';

configEnv();

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: path.join(__dirname, 'src', 'database', 'migrations'),
  },
};
