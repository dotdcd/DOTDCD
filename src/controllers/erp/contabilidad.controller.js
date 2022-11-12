import { pool } from '../../db.js'

//! START of Update employee controller

//? get estado civil
const getEstadoCivil = async() => {
    try {
        const estadoCivil = await pool.query("SELECT estado_civil_id as id, estado_civil_descripcion as nombre FROM estado_civil");
        return estadoCivil[0]
    } catch (error) {
        console.log(error)
    }
}

const getTipoEmpleado = async() => {
    try {
        const tipo = await pool.query("SELECT tipo_indirecto_id as id, tipo_indirecto_nombre as nombre FROM empleado_tipo_indirecto");
        return tipo[0]
    } catch (error) {
        console.log(error)
    }
}

const getPuesto = async() => {
    try {
        const puesto = await pool.query("SELECT puesto_id as id, puesto_descripcion as nombre FROM puestos");
        return puesto[0]
    } catch (error) {
        console.log(error)
    }
}

const getSucursal = async() => {
    try {
        const sucursal = await pool.query("SELECT sucursal_id as id, sucursal_nombre as nombre FROM sucursal");
        return sucursal[0]
    } catch (error) {
        console.log(error)
    }
}

const getEmpresa = async() => {
    try {
        const empresa = await pool.query("SELECT empresa_id as id, empresa_razon_social as nombre FROM multiempresa");
        return empresa[0]
    } catch (error) {
        console.log(error)
    }
}

const getCentrodeCosto = async() => {
    try {
        const centroCosto = await pool.query("SELECT centrodecostos_id as id, centrodecostos_descripcion as nombre FROM centrodecostos");
        return centroCosto[0]
    } catch (error) {
        console.log(error)
    }
}

const getPeriod = async() => {
    try {
        const period = await pool.query("SELECT periodo_id as id, periodo_descripcion as nombre FROM periodo");
        return period[0]
    } catch (error) {
        console.log(error)
    }
}
//? render employee update 
export const renderEmployee = async(req, res) => {
    try {
        const {id} = req.params
        const filesNeeded = ['foto', 'nacimiento', 'ine', 'curp', 'domicilio', 'imss', 'rfc', 'rec1', 'rec2', 'cv', 'covid']
        const employee = await pool.query("Select *, DATE_FORMAT(empleado_nacimiento, '%Y-%m-%d') as nacimiento, DATE_FORMAT(empleado_entrada, '%Y-%m-%d') as ingreso from empleados WHERE empleado_id = ?", [id])
        let files = []

        for(let i = 0; i < filesNeeded.length; i++) {
            const file = await pool.query("SELECT * FROM USERS_FILES WHERE type = ? AND userId = ?", [filesNeeded[i], id])
            files.push((file[0].length > 0) ? [file[0][0].type, file[0][0].file, '<button class="btn btn-outline-primary">Ver</button>'] : [filesNeeded[i], '<span class="badge badge-warning badge-pill">Documento no disponible</span>', '<input type="file" name="'+filesNeeded[i]+'" />'])
        }

        const estadoCivil = await getEstadoCivil()
        const tipoEmpleado = await getTipoEmpleado()
        const puesto = await getPuesto()
        const sucursal = await getSucursal()
        const empresa = await getEmpresa()
        const centroCostos = await getCentrodeCosto()
        const period = await getPeriod()

        return res.render('contabilidad/empleados/empleado', {empleado: employee[0][0], files, estadoCivil, tipoEmpleado, puesto, sucursal, empresa, centroCostos, period})
    } catch (error) {
        console.log(error)
    }
}

export const renderCoBuscar = async(req, res) => {


    let invArray = []
    const inv = await  pool.query("SELECT inversion_clave as clave, Inversion_descripcion as descripcion, inversion_estatus_baja as estatus FROM `inversiones`")
    inv[0].forEach(i => {
        const istatus = (i.estatus == 0) ? 'Inactivo' : 'Activo'
        invArray.push([i.clave, i.descripcion, istatus])
    });

    res.render('contabilidad/inversiones/buscar', {invArray})
}




export const renderEmBuscar = async(req, res) => {
    const empleados = await pool.query("SELECT e.empleado_id, e.empleado_nombre, e.empleado_paterno, e.empleado_materno, e.empleado_imss, e.empleado_rfc, e.empleado_curp, e.empleado_nacimiento, e.empleado_entrada, c.centrodecostos_descripcion as costos, r.empresa_razon_social as empresa, s.sucursal_nombre as sucursal FROM empleados e INNER JOIN centrodecostos c ON e.empleado_centrodecostos_id = c.centrodecostos_id INNER JOIN multiempresa r ON e.empleado_empresa_id = r.empresa_id INNER JOIN sucursal s ON e.sucursal_id = s.sucursal_id")

    res.render('contabilidad/empleados/buscar', {empleados: empleados[0]})
}


export const renderEmTodos = async(req, res) => {
    res.render('contabilidad/empleados/todos')
}

export const renderContEmployee = async(req, res) => {
    res.render('contabilidad/empleados/contrato')
}

export const renderEmNuevo = async(req, res) => {
    res.render('contabilidad/empleados/nuevo')
}

export const renderEmAsignar = async(req, res) => {
    res.render('contabilidad/empleados/asignar')
}

export const renderCoNuevo = async(req, res) => {
    res.render('contabilidad/inversiones/nuevo')
}

export const renderCoRequerir = async(req, res) => {
    res.render('contabilidad/inversiones/requerir')
}