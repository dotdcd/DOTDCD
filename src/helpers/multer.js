import path from 'path';
import {pool} from '../db.js';
import fs from 'fs-extra';
import { __dirname } from '../server.js';

export const updFiles = async (id, type) => {
    try {
        const fpath = (type == 'foto') ? path.join(__dirname, 'uploads/img/'+ id) : (type == 'varios') ? path.join(__dirname, 'uploads/varios/'+ id) : path.join(__dirname, 'uploads/files/'+ id);
        if(type != 'varios') {
            const isUploaded = await pool.query("SELECT * FROM USERS_FILES WHERE type = ? AND userId = ?", [type, id])
            if(isUploaded[0].length > 0) fs.removeSync(fpath + '\\' + isUploaded[0][0].file)
            return fpath
        } else {
            return fpath
        }
    } catch (error) {
        console.log(error)
    }
}

export const uploadFiles = async (type, fieldname) => {
    try {
        const id = await pool.query("SELECT empleado_id as id FROM empleados ORDER BY id DESC LIMIT 1");
        const vId = id[0][0].id + 1;
        const fpath = (fieldname === 'foto') ? path.join(__dirname, 'uploads/img/'+ vId) : (type == 'varios') ? path.join(__dirname, 'uploads/varios/'+ vId) : path.join(__dirname, 'uploads/files/'+ vId);;
        if(type == 'path') return fpath
        return id[0][0].id + 1
    } catch (error) {
        console.log(error)
    }
}