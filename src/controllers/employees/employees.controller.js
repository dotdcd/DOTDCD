import { pool } from '../../db.js'
import fs from 'fs-extra';
import { __dirname } from '../../server.js';
import path from 'path';


export const addEmployee = async (req, res) => {
    try {

        await pool.query("INSERT INTO empleados SET ?", {
            empleado_nombre: req.body.empleado_nombre,
            empleado_paterno: req.body.empleado_paterno,
            empleado_materno: req.body.empleado_materno,
            empleado_imss: req.body.empleado_imss,
            empleado_nacimiento: req.body.empleado_nacimiento,
            empleado_entrada: req.body.empleado_entrada,
            empleado_direccion: req.body.empleado_direccion,
            empleado_telefono: req.body.empleado_telefono,
            empleado_email: req.body.empleado_email,
            empleado_centrodecostos_id: req.body.empleado_centrodecostos_id,
            empleado_puesto_id: req.body.empleado_puesto_id,
            empleado_sueldo: req.body.empleado_sueldo,
            empleado_sueldo_imss: req.body.empleado_sueldo_imss,
            empleado_cuenta_deposito: req.body.empleado_cuenta_deposito,
            empleado_periodo_id: req.body.empleado_periodo_id,
            empleado_usuario: req.body.empleado_usuario,
            empleado_password: req.body.empleado_password,
            empleado_diario: req.body.empleado_diario,
            empleado_rfc: req.body.empleado_rfc,
            empleado_curp: req.body.empleado_curp,
            empleado_empresa_id: req.body.empleado_empresa_id,
            empleado_sexo_id: req.body.empleado_sexo_id,
            empleado_estado_civil_id: req.body.empleado_estado_civil_id,
            empleado_fecha_alta: req.body.empleado_fecha_alta,
            empleado_ultima_modificacion: req.body.empleado_ultima_modificacion,
            empleado_usuario: req.body.empleado_usuario,
            empleado_password: req.body.empleado_password,
            empleado_estatus_baja: 0,
            empleado_actividad_tipo: req.body.empleado_actividad_tipo,
            empleado_perfil_app: req.body.empleado_perfil_app,
            sucursal_id: req.body.sucursal_id,
            tipo_indirecto_id: req.body.tipo_indirecto_id,
            empleado_contacto_emergencia_nombre: req.body.empleado_contacto_emergencia_nombre,
            empleado_contacto_emergencia_telefono: req.body.empleado_contacto_emergencia_telefono
        })

        if (req.files) {
            req.files.map(async (file) => {
                await pool.query("INSERT INTO  USERS_FILES SET ?", { type: file.fieldname, file: file.filename, userId: req.body.id })
            })
        }

        return res.redirect('/dashboard/contabilidad/empleados/buscar');
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'error', message: error });
        return res.redirect('/dashboard/contabilidad/empleados/nuevo');
    }
}

export const uptEmployee = async (req, res) => {
    try {
        const { id } = req.params

        if (req.files) {
            req.files.map(async (file) => {
                await pool.query('INSERT INTO USERS_FILES SET ? ON DUPLICATE KEY UPDATE file = ?', [{ file: file.filename, type: file.fieldname, userId: id }, file.filename])
            })
        }
        // Exclude some item from req.body

        await pool.query('UPDATE empleados SET ? WHERE empleado_id = ?', [{
            empleado_nombre: req.body.empleado_nombre,
            empleado_paterno: req.body.empleado_paterno,
            empleado_materno: req.body.empleado_materno,
            empleado_imss: req.body.empleado_imss,
            empleado_nacimiento: req.body.empleado_nacimiento,
            empleado_entrada: req.body.empleado_entrada,
            empleado_direccion: req.body.empleado_direccion,
            empleado_telefono: req.body.empleado_telefono,
            empleado_email: req.body.empleado_email,
            empleado_centrodecostos_id: req.body.empleado_centrodecostos_id,
            empleado_puesto_id: req.body.empleado_puesto_id,
            empleado_sueldo: req.body.empleado_sueldo,
            empleado_sueldo_imss: req.body.empleado_sueldo_imss,
            empleado_cuenta_deposito: req.body.empleado_cuenta_deposito,
            empleado_cuenta_deposito_maquila: req.body.empleado_cuenta_deposito_maquila,
            empleado_periodo_id: req.body.empleado_periodo_id,
            empleado_usuario: req.body.empleado_usuario,
            empleado_password: req.body.empleado_password,
            empleado_diario: req.body.empleado_diario,
            empleado_rfc: req.body.empleado_rfc,
            empleado_curp: req.body.empleado_curp,
            empleado_empresa_id: req.body.empleado_empresa_id,
            empleado_sexo_id: req.body.empleado_sexo_id,
            empleado_estado_civil_id: req.body.empleado_estado_civil_id,
            empleado_fecha_alta: req.body.empleado_fecha_alta,
            empleado_ultima_modificacion: req.body.empleado_ultima_modificacion,
            empleado_usuario: req.body.empleado_usuario,
            empleado_password: req.body.empleado_password,
            empleado_estatus_baja: req.body.empleado_estatus_baja,
            empleado_fecha_baja: req.body.empleado_fecha_baja,
            empleado_actividad_tipo: req.body.empleado_actividad_tipo,
            empleado_perfil_app: req.body.empleado_perfil_app,
            sucursal_id: req.body.sucursal_id,
            tipo_indirecto_id: req.body.tipo_indirecto_id,
            empleado_contacto_emergencia_nombre: req.body.empleado_contacto_emergencia_nombre,
            empleado_contacto_emergencia_telefono: req.body.empleado_contacto_emergencia_telefono
        }, id]);

        return res.redirect('/dashboard/contabilidad/empleados/' + id);
    } catch (error) {
        console.log(error)
    }
}

export const dltEmployee = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM empleados WHERE empleado_id = ?', [id])
        await pool.query('DELETE FROM USERS_FILES WHERE userId = ?', [id])
        fs.removeSync(path.join(__dirname, '/uploads/files/'+ id+'/'))
        fs.removeSync(path.join(__dirname, '/uploads/img/'+ id+'/'))

        return res.status(200).json({ message: 'Empleado eliminado', status: 200 })
    } catch (error) {
        console.log(error)
    }
}

export const dwnEmployee = async (req, res) => {
    try{
        const { id } = req.params
        await pool.query('UPDATE empleados SET empleado_estatus_baja = 1 WHERE empleado_id = ?', [id])
        return res.status(200).json({ message: 'Empleado dado de baja', status: 200 })
    } catch (error) {
        console.log(error)
    }
}

export const dltFile = async (req, res) => {
    try { 
        const { id } = req.params
        const file = await pool.query('SELECT * FROM USERS_FILES WHERE id = ?', [id])
        const type = (file[0][0].type != 'foto') ? 'files' : 'img'
        await pool.query('DELETE FROM USERS_FILES WHERE id = ?', [id])
        fs.removeSync(path.join(__dirname, '/uploads/'+type+'/' + file[0][0].userId + '/' + file[0][0].file))

        return res.status(200).json({ message: 'Archivo eliminado', status: 200})
    }
    catch (error) {
        console.log(error)
    }
}
