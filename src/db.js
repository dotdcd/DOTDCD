import {createPool} from 'mysql2/promise';
import { db_URI } from './config.js';


const pool =  createPool({
    host: db_URI.host,
    user: db_URI.user,
    password: db_URI.password,
    port: db_URI.port,
    database: db_URI.database,
});

export {pool};