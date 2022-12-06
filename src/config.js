import dotenv from 'dotenv';

dotenv.config();

export const db_URI = {
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASS,
    port: process.env.PORT_DB,
    database: process.env.DB
}
export const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;
export const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;

export const SECRET = process.env.SECRET || 'secret'

export const PORT = process.env.SPORT || 3000;