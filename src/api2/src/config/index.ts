import * as dotenv from 'dotenv';
import { randomBytes } from "crypto";

dotenv.config();

const {
  TENANT_NAME = '',
  TENANT_SUPER_ROLE_NAME = '',
  TENANT_SUPER_USER_NAME = '',
  TENANT_SUPER_USER_PASSWORD = '',
  DB_NAME = '',
  DB_USERNAME = '',
  DB_PASSWORD = '',
  DB_HOST = '',
  PORT = 8080,
  NODE_ENV = '',
  ACCESS_TOKEN_SECRET = randomBytes(64).toString('hex'),
} = process.env;

export const config = {
  tenant: {
    name: TENANT_NAME,
    superUser: {
      username: TENANT_SUPER_USER_NAME,
      password: TENANT_SUPER_USER_PASSWORD
    },
    superRole: {
      name: TENANT_SUPER_ROLE_NAME
    }
  },
  db: {
    name: (NODE_ENV === 'test')
      ? `${DB_NAME}_test`
      : DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
  },
  port: PORT,
  environment: NODE_ENV,
  accessTokenSecret: ACCESS_TOKEN_SECRET,
}