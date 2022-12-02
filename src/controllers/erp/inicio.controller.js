import { pool } from '../../db.js'

export const renderUsuarios = async(req, res) => {
    
    try {
        const usuario = await pool.query('SELECT empleado_id as id, UPPER(CONCAT( empleado_paterno, " ", empleado_materno, " ", empleado_nombre, " ")) AS empleado FROM empleados WHERE empleado_estatus_baja = 0 ORDER BY empleado ASC')
        return res.render('inicio/usuarios', {empleado: usuario[0]})
    } catch (error) {
        console.log(error)
    }
}

