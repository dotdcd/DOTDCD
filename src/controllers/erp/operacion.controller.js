import { pool } from '../../db.js'
import axios from 'axios'


export const renderOpProyNuevo= async(req, res) => {
    res.render('operacion/proyectos/buscar')
}

export const renderOpProyBuscar= async(req, res) => {
    try {
        let proyArr = []
        const proyectos = await pool.query("SELECT c.cotizacion_id as cotizacion_id, cotizacion_cliente_id, cliente_razon_social,cotizacion_proyecto, CAST(cotizacion_fecha_alta AS DATE) as cotizacion_fecha_alta, CONCAT(cliente_razon_social, ' ', cotizacion_proyecto, ' ', cotizacion_fecha_alta) AS cotizacion_completa, CONCAT(e.empleado_nombre, ' ', e.empleado_paterno, ' ', e.empleado_materno) as nombre_completo, cotizacion_autorizada_estatus, cotizacion_estatus_baja, IFNULL(tablita_id, 0) as tablita_id,CONCAT(e2.empleado_nombre, ' ', e2.empleado_paterno, ' ', e2.empleado_materno) as usuario_creo FROM clientes JOIN cotizaciones c ON cliente_id = cotizacion_cliente_id  JOIN empleados e ON cotizacion_empleado_id = e.empleado_id LEFT JOIN tablita t ON t.cotizacion_id = c.cotizacion_id LEFT JOIN empleados e2 ON t.usuario_modifico = e2.empleado_id  ORDER BY cotizacion_id DESC")
        for (const p of proyectos[0]) {
            const cstatus = (p.cotizacion_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            const cautorizada = (p.cotizacion_autorizada_estatus == 0) ? "<span class='badge badge-success badge-pill'>Autorizada</span>" : "<span class='badge badge-danger badge-pill'>No Autorizada</span>"
            proyArr.push([p.cotizacion_id, p.cliente_razon_social, p.cotizacion_fecha_alta, p.cotizacion_proyecto, p.nombre_completo, cstatus, cautorizada, '<center><a href="/dashboard/operacion/proyectos/editar/'+p.cotizacion_id+'" class="btn btn-lg btn-outline-success m-1" "><i class="fal fa-sync"></i></a>  <button type="button" class="btn btn-lg btn-outline-danger" onClick="delProyecto(' + p.cotizacion_id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
        }   
        
        res.render('operacion/proyectos/buscar', { proyArr })
    } catch (error) {
        console.log(error)
    }
}
