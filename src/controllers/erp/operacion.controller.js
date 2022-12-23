import { pool } from '../../db.js'
import axios from 'axios'



const getMoneda = async() => {
    const moneda = await pool.query("SELECT moneda_id, moneda_descripcion FROM monedas")
    return moneda[0]
}

const getSucursal = async() => {
    const sucursal = await pool.query("SELECT sucursal_id, sucursal_nombre FROM sucursal")
    return sucursal[0]
}

const getEmpresa    = async() => {
    const empresa = await pool.query("SELECT empresa_id, empresa_razon_social FROM multiempresa WHERE empresa_estatus_baja = 0")
    return empresa[0]
}

const getCliente = async() => {
    const cliente = await pool.query("SELECT cliente_id, cliente_razon_social FROM clientes")
    return cliente[0]
}

const getEmpleado = async() => {
    const empleado = await pool.query("SELECT empleado_id, CONCAT(empleado_nombre, ' ', empleado_paterno, ' ', empleado_materno) as nombre_completo FROM empleados WHERE empleado_estatus_baja = 0")
    return empleado[0]

}
export const renderOpProyNuevo= async(req, res) => {

    try {
        const moneda = await getMoneda()
        const sucursales = await getSucursal()
        const empresaa = await getEmpresa()
        const clientes = await getCliente()
        const empleados = await getEmpleado()
        res.render('operacion/proyectos/nuevo', { clientes, sucursales, empresaa, moneda, empleados })
    } catch (error) {
        console.log(error)

    }
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


//? Render Requisiciones
export const renderOpReqBuscar = async(req, res) => {
    try {
        const rqc = await pool.query("SELECT r.requisicion_id as id, r.requisicion_comentarios as comentarios, c.cotizacion_descripcion as cotizacion, CONCAT(e.empleado_nombre, ' ', e.empleado_paterno, ' ', e.empleado_materno) as empleado, DATE_FORMAT(r.requisicion_fecha, '%Y-%m-%d') as fecha FROM requisiciones r INNER JOIN cotizaciones c ON c.cotizacion_id = r.requisicion_cotizacion_id INNER JOIN empleados e ON e.empleado_id = r.requisicion_empleado_id")
        let requisiciones = []
        for (const r of rqc[0]) {
            requisiciones.push([r.id, r.comentarios, r.cotizacion, r.empleado, r.fecha, r.comentarios, '<center><a href="/dashboard/operacion/requerimientos/editar/'+r.id+'" class="btn btn-lg btn-outline-success m-1" "><i class="fal fa-sync"></i></a>  <button type="button" class="btn btn-lg btn-outline-danger" onClick="delRequisicion(' + r.id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
        }
        res.render('operacion/proyectos/requisiciones/buscar', { requisiciones })
    } catch (error) {
        console.log(error)
    }
}

export const renderOpReqNuevo = async(req, res) => {
    try {

        res.render('operacion/proyectos/requisiciones/nuevo')
    } catch (error) {
        console.log(error)
    }
}
const getClientes = async() => {
    const clientes = await pool.query("SELECT cliente_id, cliente_razon_social FROM clientes")
    return clientes[0]
}
const getEmpleados = async() => {
    const empleados = await pool.query("SELECT empleado_id, CONCAT(empleado_nombre, ' ', empleado_paterno, ' ', empleado_materno) as nombre_completo FROM empleados WHERE empleado_estatus_baja = 0")
    return empleados[0]
}
const getCotizaciones = async() => {
    const cotizaciones = await pool.query("SELECT cotizacion_id, cotizacion_descripcion FROM cotizaciones")
    return cotizaciones[0]
}
const getEmpresas = async() => {
    const empresas = await pool.query("SELECT empresa_id, empresa_razon_social FROM multiempresa")
    return empresas[0]
}
const getInversion = async() => {
    const inversion = await pool.query("SELECT inversion_id, inversion_descripcion FROM inversiones")
    return inversion[0]
}

const getFamilias = async() => {
    const familias = await pool.query("SELECT familia_id, familia_descripcion FROM familias")
    return familias[0]
}

const getRequisicion = async(id) => {
    const requisicion = await pool.query("SELECT requisicion_id, requisicion_comentarios, requisicion_cotizacion_id, requisicion_empleado_id, DATE_FORMAT(requisicion_fecha, '%Y-%m-%d') as fecha FROM requisiciones WHERE requisicion_id = ?", [id])
    return requisicion[0][0]
}

export const renderOpReqEditar = async(req, res) => {
    try {
        const { id } = req.params.id

        const clientes = await getClientes()
        const empleados = await getEmpleados()
        const cotizaciones = await getCotizaciones()
        const empresas = await getEmpresas()
        const inversion = await getInversion()
        const familias = await getFamilias()
        const r = await getRequisicion(req.params.id)
        console.log(r)
        return res.render('operacion/proyectos/requisiciones/editar', { clientes, empleados, cotizaciones, empresas, inversion, familias, r})
    } catch (error) {
        console.log(error)
    }
}
//! Render Requisiciones