import path from 'path';
import {pool} from '../db.js';
import { fileURLToPath } from 'url'
import fs from 'fs';
import { __dirname } from '../server.js';

export const updFiles = async (id, type) => {
    try {
        const fpath = (type == 'foto') ? path.join(__dirname, 'uploads/img/'+ id) : path.join(__dirname, 'uploads/files/'+ id);
        const isUploaded = await pool.query("SELECT * FROM USERS_FILES WHERE type = ? AND userId = ?", [type, id])
        if(isUploaded[0].length > 0) fs.unlinkSync(fpath + '\\' + isUploaded[0][0].file)
        return fpath
    } catch (error) {
        console.log(error)
    }
}

export const uploadFiles = async (type, fieldname) => {
    try {
        const id = await pool.query("SELECT empleado_id as id FROM empleados ORDER BY id DESC LIMIT 1");
        const vId = id[0][0].id + 1;
        const fpath = (fieldname === 'foto') ? path.join(__dirname, 'uploads/img/'+ vId) : path.join(__dirname, 'uploads/files/'+ vId);
        if(type == 'path') return fpath
        return id[0][0].id + 1
    } catch (error) {
        console.log(error)
    }
}