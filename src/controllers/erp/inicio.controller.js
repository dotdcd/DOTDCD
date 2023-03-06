import { pool } from '../../db.js'

const getEmpleados = async() => {
    const empleado = await pool.query('SELECT empleado_id as id, UPPER(CONCAT( empleado_paterno, " ", empleado_materno, " ", empleado_nombre, " ")) AS empleado FROM empleados WHERE empleado_estatus_baja = 0 ORDER BY empleado ASC')
    const empleados = empleado[0]
    return empleados
}

export const renderUsuarios = async(req, res) => {
    
    try {
        const usuario = await pool.query('SELECT usuarios.id, usuarios.username, CONCAT(empleados.empleado_nombre," ", empleados.empleado_paterno," ",empleados.empleado_materno) as nombre, id_empleado, usuarios.status FROM `usuarios` JOIN empleados ON usuarios.id_empleado = empleados.empleado_id WHERE usuarios.status = 1')
        const users = usuario[0]
        let uarray = []
        for (const us of users) {
            uarray.push([us.id_empleado, us.username, us.nombre, '<center><a href="/dashboard/inicio/usuario/editar/' + us.id_empleado + '" class="btn btn-lg btn-outline-success m-1" ><i class="fal fa-sync"></i></a>  <form method="post" action="/delUsuario/' + us.id + '"> </form><center>'])
        }
        const empleadosss = await getEmpleados()
        res.render('inicio/usuarios', { uarray, empleadosss })      
    } catch (error) {
        console.log(error)
    }
}

export const renderEditarUsuario = async(req, res) => {
    try{
        const { id } = req.params
    const usuario = await pool.query('SELECT id, username, password, id_empleado, status FROM `usuarios` WHERE `id_empleado` = '+id)
    const empleado = await pool.query('SELECT empleado_id as id, UPPER(CONCAT( empleado_paterno, " ", empleado_materno, " ", empleado_nombre, " ")) AS empleado FROM empleados WHERE empleado_estatus_baja = 0 ORDER BY empleado ASC')
    const empleados = empleado[0]
    const usuarioA = usuario[0][0]
    const usuarioID = usuarioA.id
    const empleadosss = await getEmpleados()
    res.render('inicio/usuarioEditar', { usuarioA, empleados, usuarioID, empleadosss })
    }
    catch(error){
        console.log(error)
    }
}

//? Actualizar usuario
