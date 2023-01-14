import dotenv from 'dotenv';

dotenv.config();

//? Database URI
export const db_URI = {
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASS,
    port: process.env.PORT_DB,
    database: process.env.DB
}

//? VAPID keys for push notifications
export const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;
export const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;

//? JWT Secret
export const SECRET = process.env.SECRET || 'secret'

//? SW sapiens URL
export const SW_SAPIENS_URL = process.env.SW_TEST_URL
export const SW_TOKEN = process.env.SW_TOKEN
export const RFC = process.env.RFC


//? Server Port
export const PORT = process.env.SPORT || 3000;