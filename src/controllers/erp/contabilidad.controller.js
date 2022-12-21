import { render } from 'preact/compat';
import { pool } from '../../db.js'
import { getTotal } from './analytics.controller.js';

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

export const getSucursal = async() => {
    try {
        const sucursal = await pool.query("SELECT sucursal_id as id, sucursal_nombre as nombre FROM sucursal");
        return sucursal[0]
    } catch (error) {
        console.log(error)
    }
}

export const getEmpresa = async() => {
    try {
        const empresa = await pool.query("SELECT empresa_id as id, empresa_razon_social as nombre FROM multiempresa WHERE empresa_estatus_baja = 0");
        return empresa[0]
    } catch (error) {
        console.log(error)
    }
}

export const getCentrodeCosto = async() => {
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

const getPastContracts = async (id) => {
    try {
        const pContracts = await pool.query("SELECT i.id, i.firma, i.nombre, i.apellidos, t.tipo_indirecto_nombre as departamento, s.sucursal_nombre as sucursal, i.sueldo, e.empresa_razon_social as empresa, i.inicio, i.vencimiento, i.fecha_firma, i.reconocimiento, i.empleado_id, i.status, i.periodo FROM (SELECT c.id, e.empleado_nombre as nombre, CONCAT(e.empleado_paterno, ' ', e.empleado_materno) as apellidos, e.tipo_indirecto_id as departamento, e.sucursal_id as sucursal, c.sueldo as sueldo, e.empleado_empresa_id as empresa, DATE_FORMAT(c.fecha_inicio, '%Y-%m-%d') as inicio, DATE_FORMAT(c.fecha_fin, '%Y-%m-%d') as vencimiento, DATE_FORMAT(c.fecha_firma, '%Y-%m-%d') as fecha_firma, c.empleado_id, c.status, c.periodo, c.firma, DATE_FORMAT(c.reconocimiento, '%Y-%m-%d') as reconocimiento FROM contratosTotales c INNER JOIN empleados e ON e.empleado_id = c.empleado_id) i INNER JOIN empleado_tipo_indirecto t ON i.departamento = t.tipo_indirecto_id INNER JOIN sucursal s ON i.sucursal = s.sucursal_id INNER JOIN multiempresa e ON i.empresa = e.empresa_id WHERE i.empleado_id = ?", [id])
        let contratos = [];
        for (const c of pContracts[0]) {
            contratos.push([c.nombre, c.apellidos, c.departamento, c.sucursal, c.empresa, (c.periodo == 1) ? '1 mes' : (c.periodo == 2) ? '3 meses' : '6 meses',c.sueldo, c.inicio, c.vencimiento, c.fecha_firma, c.reconocimiento, "<a href='/dashboard/contabilidad/empleados/contrato_pasado/"+c.id+"'><button class='btn btn-outline-success'>Ver Contrato</button></a>"])
        }
        return contratos
    } catch (error) {
        console.log(error)
    }
}


//? render employee update 
export const renderEmployee = async(req, res) => {
    try {
        const {id} = req.params
        const filesNeeded = ['foto', 'nacimiento', 'ine', 'curp', 'domicilio', 'imss', 'rfc', 'Infonavit', 'Otros', 'cv', 'covid', 'contratos', 'contrato anterior']
        const employee = await pool.query("Select *, DATE_FORMAT(empleado_nacimiento, '%Y-%m-%d') as nacimiento, DATE_FORMAT(empleado_entrada, '%Y-%m-%d') as ingreso from empleados WHERE empleado_id = ?", [id])
        let files = []
        for(let i = 0; i < filesNeeded.length; i++) {
            const file = await pool.query("SELECT * FROM USERS_FILES WHERE type = ? AND userId = ?", [filesNeeded[i], id])
            files.push((file[0].length > 0) ? [file[0][0].type, file[0][0].file, '<a class="btn btn-outline-primary" href="/dashboard/documento/'+file[0][0].id+'"><i class="fal fa-file-search"></i></a><button class="btn btn-outline-danger" onclick="showModalDel('+file[0][0].id+')" ><i class="fal fa-trash-alt"></i></button>'] : [filesNeeded[i], '<span class="badge badge-warning badge-pill">Documento no disponible</span>', '<input type="file" name="'+filesNeeded[i]+'" />'])
        }
        let documents = []
        const docs = await pool.query("SELECT * FROM documentos WHERE userId = ?", [id])
        for (const doc of docs[0]) {
            documents.push([doc.file, '<a class="btn btn-outline-primary" href="/dashboard/documento/v/'+doc.id+'"><i class="fal fa-file-search"></i></a><button class="btn btn-outline-danger" onclick="showModalDel('+doc.id+')" ><i class="fal fa-trash-alt"></i></button>'])
        }

        const estadoCivil = await getEstadoCivil()
        const tipoEmpleado = await getTipoEmpleado()
        const puesto = await getPuesto()
        const sucursal = await getSucursal()
        const empresa = await getEmpresa()
        const centroCostos = await getCentrodeCosto()
        const period = await getPeriod()
        const pContracts = await getPastContracts(id)
        
        return res.render('contabilidad/empleados/empleado', {empleado: employee[0][0], files, estadoCivil, tipoEmpleado, puesto, sucursal, empresa, centroCostos, period, pContracts, documents})
    } catch (error) {
        console.log(error)
    }
}

export const renderCoBuscar = async(req, res) => {
    let invArray = []
    const inv = await  pool.query("SELECT inversion_id, inversion_clave as clave, Inversion_descripcion as descripcion, inversion_estatus_baja as estatus FROM `inversiones`")
    inv[0].forEach(i => {
        const istatus = (i.estatus == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>"  : "<span class='badge badge-success badge-pill'>Activo</span>"
        invArray.push([i.clave, i.descripcion, istatus, '<center><a href="/dashboard/contabilidad/inversiones/editar/'+i.inversion_id+'"><button type="button" class="btn btn-lg btn-outline-success m-1"><i class="fal fa-sync"></i></button></a> <button type="button" class="btn btn-lg btn-outline-danger" onClick="delInversion(' + i.inversion_id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
    });

    res.render('contabilidad/inversiones/buscar', {invArray})
}




export const renderEmBuscar = async(req, res) => {
    const empleados = await pool.query("SELECT e.empleado_id, e.empleado_nombre, e.empleado_paterno, e.empleado_materno, e.empleado_imss, e.empleado_rfc, e.empleado_curp, DATE_FORMAT(e.empleado_nacimiento, '%Y-%m-%d') as empleado_nacimiento, DATE_FORMAT(e.empleado_entrada, '%Y-%m-%d') as empleado_entrada, c.centrodecostos_descripcion as costos, r.empresa_razon_social as empresa, s.sucursal_nombre as sucursal FROM empleados e INNER JOIN centrodecostos c ON e.empleado_centrodecostos_id = c.centrodecostos_id INNER JOIN multiempresa r ON e.empleado_empresa_id = r.empresa_id INNER JOIN sucursal s ON e.sucursal_id = s.sucursal_id WHERE e.empleado_estatus_baja = 0")

    res.render('contabilidad/empleados/buscar', {empleados: empleados[0]})
}


export const renderEmNuevo = async(req, res) => {

    const estadoCivil = await getEstadoCivil()
    const tipoEmpleado = await getTipoEmpleado()
    const puesto = await getPuesto()
    const sucursal = await getSucursal()
    const empresa = await getEmpresa()
    const centroCostos = await getCentrodeCosto()
    const period = await getPeriod()
    res.render('contabilidad/empleados/nuevo', {estadoCivil, tipoEmpleado, puesto, sucursal, empresa, centroCostos, period})
}

//? Render employees documents
export const renderDoc = async(req, res) => {
    const {id} = req.params
    const file = await pool.query("SELECT * FROM USERS_FILES WHERE id = ?", [id])
    return res.render('contabilidad/empleados/viewDoc', {file: file[0][0], type: 'files'})
}

export const renderDocV = async(req, res) => {
    const {id} = req.params
    const file = await pool.query("SELECT * FROM documentos WHERE id = ?", [id])
    return res.render('contabilidad/empleados/viewDoc', {file: file[0][0], type: 'varios'})
}

//! Contratos section
const getFechas = async () => {
    try {
        const hoy = new Date()
        const mes = hoy.getMonth() + 1
        const inicio = (mes > 6 ) ? hoy.getFullYear()+1+'-01-01' : hoy.getFullYear()+'-07-01'
        const fin = (mes > 6 ) ? hoy.getFullYear()+1+'-06-30' : hoy.getFullYear()+'-12-31'
        return {inicio, fin}
    } catch (error) {
        console.log(error)
    }
}

const getEmployees = async (date) => {
    try {
        let empleados = []
        const empresas = await getEmpresa()
        let option = '<option value="" selected disabled></option>'
        
        for (const i of empresas) {
            option += `<option value="${i.id}">${i.nombre}</option>`
        }
        const employees = await pool.query("SELECT e.empleado_id as id, e.empleado_nombre as nombre, CONCAT(e.empleado_paterno, ' ', e.empleado_materno) as apellidos, p.puesto_descripcion as departamento, s.sucursal_nombre as sucursal, e.empleado_sueldo as sueldo, m.empresa_razon_social as empresa, DATE_FORMAT(e.empleado_entrada, '%Y-%m-%d') as inicio FROM empleados e INNER JOIN sucursal s ON e.sucursal_id = s.sucursal_id INNER JOIN multiempresa m ON e.empleado_empresa_id = m.empresa_id INNER JOIN puestos p ON e.empleado_puesto_id = p.puesto_id WHERE e.empleado_estatus_baja = 0")
        for (const e of employees[0]) {
            empleados.push([ '<form id="form'+e.id+'" >'+e.nombre+'</form>', e.apellidos, e.departamento, e.sucursal, '<select form="form'+e.id+'" class="form-control" name="empresa">'+option+'</select>', '<select form="form'+e.id+'" name="periodo" class="form-control"> <option value="1"> 1 mes </option> <option value="3"> 3 meses</option> <option value="6" selected> 6 meses </option> </select>', '<input type="text" form="form'+e.id+'" name="sueldo" value="'+e.sueldo * 2+'" class="form-control">', '<input form="form'+e.id+'" type="date" name="inicio" value="'+date.inicio+'" class="form-control"/>', '<input form="form'+e.id+'" type="date" name="vencimiento" class="form-control" value="'+date.fin+'">', '<button class="btn btn-outline-success" onclick="addContract('+e.id+')"> Contratar </button>'])
        }
        return empleados
    } catch (error) {
        console.log(error)
    }
}

                                    
const getWaitContracts = async () => {
    try {
        const contracts = await pool.query("SELECT i.id, i.firma, i.nombre, i.apellidos, p.puesto_descripcion as departamento, s.sucursal_nombre as sucursal, i.sueldo, e.empresa_razon_social as empresa, i.inicio, i.vencimiento, i.fecha_firma, i.reconocimiento, i.empleado_id, i.status, i.periodo FROM (SELECT c.id, e.empleado_nombre as nombre, CONCAT(e.empleado_paterno, ' ', e.empleado_materno) as apellidos,  e.empleado_puesto_id as departamento, e.sucursal_id as sucursal, c.sueldo as sueldo, e.empleado_empresa_id as empresa, DATE_FORMAT(c.fecha_inicio, '%Y-%m-%d') as inicio, DATE_FORMAT(c.fecha_fin, '%Y-%m-%d') as vencimiento, DATE_FORMAT(c.fecha_firma, '%Y-%m-%d') as fecha_firma, c.reconocimiento, c.empleado_id, c.status, c.periodo, c.firma FROM CONTRATOS c INNER JOIN empleados e ON e.empleado_id = c.empleado_id) i INNER JOIN puestos p ON i.departamento = p.puesto_id INNER JOIN sucursal s ON i.sucursal = s.sucursal_id INNER JOIN multiempresa e ON i.empresa = e.empresa_id WHERE i.status = 1")
        let contratos = []
        for (const c of contracts[0]) {
            contratos.push([c.nombre, c.apellidos, c.departamento, c.sucursal, c.empresa, (c.periodo == 1) ? '1 mes' : (c.periodo == 2) ? '3 meses' : '6 meses',c.sueldo, c.inicio, c.vencimiento, c.fecha_firma, '<button class="btn btn-outline-success" onclick="aceptContract('+c.id+', 2)">Aceptar </button> <button class="btn btn-outline-danger mr-2 ml-2" onclick="declibeContract('+c.id+', 0)"> Rechazar </button> <button class="btn btn-outline-info" onclick="viewSignature(&#39'+c.firma+'&#39)"> Ver Firma </button>'])
        }
        return contratos
    } catch (error) {
        console.log(error)
    }
}

const getActualContracts = async () => {
    try {
        const contracts = await pool.query("SELECT i.firma, i.nombre, i.apellidos, p.puesto_descripcion as departamento, s.sucursal_nombre as sucursal, i.sueldo, e.empresa_razon_social as empresa, i.inicio, i.vencimiento, i.fecha_firma, i.reconocimiento, i.empleado_id, i.status, i.periodo FROM (SELECT e.empleado_nombre as nombre, CONCAT(e.empleado_paterno, ' ', e.empleado_materno) as apellidos, e.empleado_puesto_id as departamento, e.sucursal_id as sucursal, c.sueldo as sueldo, e.empleado_empresa_id as empresa, DATE_FORMAT(c.fecha_inicio, '%Y-%m-%d') as inicio, DATE_FORMAT(c.fecha_fin, '%Y-%m-%d') as vencimiento, DATE_FORMAT(c.fecha_firma, '%Y-%m-%d') as fecha_firma, c.empleado_id, c.status, c.periodo, c.firma, DATE_FORMAT(c.reconocimiento, '%Y-%m-%d') as reconocimiento FROM CONTRATOS c INNER JOIN empleados e ON e.empleado_id = c.empleado_id) i INNER JOIN puestos p ON i.departamento = p.puesto_id INNER JOIN sucursal s ON i.sucursal = s.sucursal_id INNER JOIN multiempresa e ON i.empresa = e.empresa_id WHERE i.status = 2")
        let contratos = []
        for (const c of contracts[0]) {
            contratos.push([c.nombre, c.apellidos, c.departamento, c.sucursal, c.empresa, (c.periodo == 1) ? '1 mes' : (c.periodo == 2) ? '3 meses' : '6 meses',c.sueldo, c.inicio, c.vencimiento, c.fecha_firma, c.reconocimiento, "<a href='/dashboard/contabilidad/empleados/ver/contrato/"+c.empleado_id+"'><button class='btn btn-outline-success'>Ver Contrato</button></a>"])
        }
        return contratos
    } catch (error) {
        console.log(error)
    }
}

const getTestifys = async () => {
    try {
        let firmas = []
        const signatures = await pool.query("SELECT * FROM firmas")
        for (const s of signatures[0]) {
            firmas.push(['<center><img class="rounded " width="200" height="100" src="'+s.firma+'"/></center>', s.nombre, (s.lvl == 1) ? 'Patrón' : (s.lvl == 2) ? 'Testigo 1' : 'Testigo 2', '<center><button class="btn btn-outline-danger" onclick="dltTestify('+s.id+')"> Eliminar </button></center>'])
        }
        return firmas
    } catch (error) {
        console.log(error)
    }
}

const getTotalContracts = async () => {
    try {
        const contracts = await pool.query("SELECT COUNT(*) as total FROM CONTRATOS WHERE status = 2")
        return contracts[0][0].total
    } catch (error) {
        console.log(error)
    }
}

export const renderContratos = async(req, res) => {

    const date = await getFechas()
    const empleados = await getEmployees(date)
    const waitContracts = await getWaitContracts()
    const actualContracts = await getActualContracts()
    const testifys = await getTestifys()
    const totals = await getTotal()
    const contracts = await getTotalContracts()
    const empresa = await getEmpresa()

    return res.render('contabilidad/empleados/contratos', {empleados, waitContracts, actualContracts, testifys, totals, contracts, empresa})
}

export const renderSignature = async(req, res) => {
    try {
        const {id} = req.params
        const contrato = await pool.query("SELECT p.puesto_descripcion as puesto, i.id, i.nacimiento, i.firma, i.nombre, i.apellidos, i.direccion, t.tipo_indirecto_nombre as departamento, s.sucursal_nombre as sucursal, i.sueldo, e.empresa_razon_social as empresa, i.inicio, i.vencimiento, i.fecha_firma, i.reconocimiento, i.empleado_id, i.status, i.periodo FROM (SELECT c.id, e.empleado_nombre as nombre, CONCAT(e.empleado_paterno, ' ', e.empleado_materno) as apellidos, DATE_FORMAT(e.empleado_nacimiento, '%Y-%m-%D') as nacimiento, e.empleado_direccion as direccion, e.tipo_indirecto_id as departamento, e.sucursal_id as sucursal, c.sueldo as sueldo, e.empleado_puesto_id, e.empleado_empresa_id as empresa, DATE_FORMAT(c.fecha_inicio, '%Y-%m-%d') as inicio, DATE_FORMAT(c.fecha_fin, '%Y-%m-%d') as vencimiento, DATE_FORMAT(c.fecha_firma, '%Y-%m-%d') as fecha_firma, c.empleado_id, c.status, c.periodo, c.firma, DATE_FORMAT(c.reconocimiento, '%Y-%m-%d') as reconocimiento FROM CONTRATOS c INNER JOIN empleados e ON e.empleado_id = c.empleado_id) i INNER JOIN empleado_tipo_indirecto t ON i.departamento = t.tipo_indirecto_id INNER JOIN sucursal s ON i.sucursal = s.sucursal_id INNER JOIN multiempresa e ON i.empresa = e.empresa_id INNER JOIN puestos p ON i.empleado_puesto_id = p.puesto_id WHERE i.empleado_id = ? AND status = 0", [id])

        const info = contrato[0][0]
        return res.render('contabilidad/empleados/signature', {layout: 'auth', info})   
    } catch (error) {
        console.log(error)
    }
}

export const renderContrato = async(req, res) => {
    try {
        const {id} = req.params
        const contrato = await pool.query("SELECT p.puesto_descripcion as puesto, i.id, i.nacimiento, i.firma, i.nombre, i.apellidos, i.direccion, t.tipo_indirecto_nombre as departamento, s.sucursal_nombre as sucursal, i.sueldo, e.empresa_razon_social as empresa, i.inicio, i.vencimiento, i.fecha_firma, i.reconocimiento, i.empleado_id, i.status, i.periodo FROM (SELECT c.id, e.empleado_nombre as nombre, CONCAT(e.empleado_paterno, ' ', e.empleado_materno) as apellidos, DATE_FORMAT(e.empleado_nacimiento, '%Y-%m-%D') as nacimiento, e.empleado_direccion as direccion, e.tipo_indirecto_id as departamento, e.sucursal_id as sucursal, c.sueldo as sueldo, e.empleado_puesto_id, e.empleado_empresa_id as empresa, DATE_FORMAT(c.fecha_inicio, '%Y-%m-%d') as inicio, DATE_FORMAT(c.fecha_fin, '%Y-%m-%d') as vencimiento, DATE_FORMAT(c.fecha_firma, '%Y-%m-%d') as fecha_firma, c.empleado_id, c.status, c.periodo, c.firma, DATE_FORMAT(c.reconocimiento, '%Y-%m-%d') as reconocimiento FROM CONTRATOS c INNER JOIN empleados e ON e.empleado_id = c.empleado_id) i INNER JOIN empleado_tipo_indirecto t ON i.departamento = t.tipo_indirecto_id INNER JOIN sucursal s ON i.sucursal = s.sucursal_id INNER JOIN multiempresa e ON i.empresa = e.empresa_id INNER JOIN puestos p ON i.empleado_puesto_id = p.puesto_id WHERE i.empleado_id = ? AND status = 2", [id])

        const signatures = await pool.query("SELECT * FROM firmas")
        if(signatures[0].length != 3){
            req.flash('error', {title: '...Ooops!', message: 'No se puede generar un contrato sin las firmas necesarias, intenta registrar firmas de testigos y/o patrón'})
            return res.redirect('/dashboard/contabilidad/empleados/ver/contratos')
        }

        const info = contrato[0][0]
        const firmas = signatures[0]
        return res.render('contabilidad/empleados/contratoDoc', {info, firmas})
    } catch (error) {
        console.log(error)
    }
}

export const renderPastContrato = async (req, res) => {
    try {
        const {id} = req.params
        const contrato = await pool.query("SELECT p.puesto_descripcion as puesto, i.id, i.nacimiento, i.firma, i.nombre, i.apellidos, i.direccion, t.tipo_indirecto_nombre as departamento, s.sucursal_nombre as sucursal, i.sueldo, e.empresa_razon_social as empresa, i.inicio, i.vencimiento, i.fecha_firma, i.reconocimiento, i.empleado_id, i.status, i.periodo FROM (SELECT c.id, e.empleado_nombre as nombre, CONCAT(e.empleado_paterno, ' ', e.empleado_materno) as apellidos, DATE_FORMAT(e.empleado_nacimiento, '%Y-%m-%D') as nacimiento, e.empleado_direccion as direccion, e.tipo_indirecto_id as departamento, e.sucursal_id as sucursal, c.sueldo as sueldo, e.empleado_puesto_id, e.empleado_empresa_id as empresa, DATE_FORMAT(c.fecha_inicio, '%Y-%m-%d') as inicio, DATE_FORMAT(c.fecha_fin, '%Y-%m-%d') as vencimiento, DATE_FORMAT(c.fecha_firma, '%Y-%m-%d') as fecha_firma, c.empleado_id, c.status, c.periodo, c.firma, DATE_FORMAT(c.reconocimiento, '%Y-%m-%d') as reconocimiento FROM contratosTotales c INNER JOIN empleados e ON e.empleado_id = c.empleado_id) i INNER JOIN empleado_tipo_indirecto t ON i.departamento = t.tipo_indirecto_id INNER JOIN sucursal s ON i.sucursal = s.sucursal_id INNER JOIN multiempresa e ON i.empresa = e.empresa_id INNER JOIN puestos p ON i.empleado_puesto_id = p.puesto_id WHERE i.id = ?", [id])

        const signatures = await pool.query("SELECT * FROM firmas")
        if(signatures[0].length != 3){
            req.flash('error', {title: '...Ooops!', message: 'No se puede generar un contrato sin las firmas necesarias, intenta registrar firmas de testigos y/o patrón'})
            return res.redirect('/dashboard/contabilidad/empleados/ver/contratos')
        }

        const info = contrato[0][0]
        const firmas = signatures[0]
        console.log(info)
        return res.render('contabilidad/empleados/contratoDoc', {info, firmas})
    } catch (error) {
        console.log(error)        
    }
}

export const renderEmAsignar = async(req, res) => {
    res.render('contabilidad/empleados/asignar')
}

//?Inversiones
export const renderCoNuevo = async(req, res) => {
    res.render('contabilidad/inversiones/nuevo')
}

export const renderCoRequerir = async(req, res) => {
    res.render('contabilidad/inversiones/requerir')
}


const getInversiones = async() => {
    try {
        const inversiones = await pool.query("SELECT * FROM inversiones")
        return inversiones[0][0]
    } catch (error) {
        console.log(error)
    }
}

export const renderCoEditar = async(req, res) => {
    const {id} = req.params
    try {
        const inversion = await pool.query("SELECT * FROM inversiones WHERE inversion_id = ?", [id])
        const info = inversion[0][0]
        res.render('contabilidad/inversiones/editar', {info})
    } catch (error) {
        console.log(error)
    }
}


//! fin render inversiones


export const renderEmTodos = async(req, res) => {
    res.render('contabilidad/empleados/todos')
}

export const renderContEmployee = async(req, res) => {
    res.render('contabilidad/empleados/contrato')
}


//? Render Multiempresas
export const renderBMultiempresas = async(req, res) => {
    try {
        let multiArray = []
        const empresas = await pool.query("SELECT empresa_id, empresa_razon_social, empresa_direccion, empresa_colonia, empresa_ciudad_estado, empresa_rfc, empresa_telefono, empresa_registro_patronal, empresa_estatus_baja FROM multiempresa")
        for (const m of empresas[0]) {
            const cstatus = (m.empresa_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            multiArray.push([m.empresa_razon_social, m.empresa_direccion, m.empresa_colonia, m.empresa_ciudad_estado, m.empresa_rfc, m.empresa_telefono, m.empresa_registro_patronal, cstatus, '<center><a href="/dashboard/contabilidad/multiempresas/editar/'+m.empresa_id+'"><button type="button" class="btn btn-lg btn-outline-success m-1"><i class="fal fa-sync"></i></button></a> <button type="button" class="btn btn-lg btn-outline-danger" onClick="delEmpresa(' + m.empresa_id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
        }
        return res.render('contabilidad/multiempresas/buscar', {multiArray})
    } catch (error) {
        console.log(error)
    }
}
export const renderNMultiempresas = async(req, res) => {
    res.render('contabilidad/multiempresas/nuevo')
}


const getEmpresas = async (id) => {
    try {
        const empresa = await pool.query("SELECT * FROM multiempresa WHERE empresa_id = ?", [id])
        return empresa[0][0]
    } catch (error) {
        console.log(error)
    }
}

export const renderEMultiempresas = async(req, res) => {
    try {
        const {id} = req.params
        const empresa = await getEmpresas(id)
        return res.render('contabilidad/multiempresas/editar', {empresa})
    } catch (error) {
        console.log(error)
    }
}


//! End Render Multiempresas

//? render jornadas
export const renderJornadas = async(req, res) => {
    res.render('contabilidad/jornadas/jornadas')
}



//? render Bancos



export const renderBBuscar = async (req, res) => {
    try {
        let cuentasArray = []
        const cuentas = await pool.query("SELECT banco_cuenta_id, banco_cuenta_banco, banco_cuenta_numero, banco_cuenta_contacto, banco_cuenta_clabe, banco_cuenta_comentario, banco_cuenta_saldo_inicial, banco_cuenta_limite_credito, banco_cuenta_moneda_id, (SELECT moneda_descripcion FROM monedas WHERE moneda_id = banco_cuenta_moneda_id) as moneda, banco_empresa_id, (SELECT empresa_razon_social FROM multiempresa WHERE empresa_id = banco_empresa_id) as empresa, banco_cuenta_tipo_id, (SELECT cuenta_tipo_descripcion FROM bancos_cuentas_tipos WHERE cuenta_tipo_id = banco_cuenta_tipo_id) as tipo, banco_cuenta_estatus_baja FROM bancos_cuentas")
        for (const b of cuentas[0]) {
            const csstatus = (b.banco_cuenta_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            cuentasArray.push([b.banco_cuenta_numero, b.banco_cuenta_banco, b.banco_cuenta_clabe, b.banco_cuenta_comentario, b.banco_cuenta_contacto, b.banco_cuenta_saldo_inicial, b.banco_cuenta_limite_credito, b.moneda, b.empresa, b.tipo, csstatus, '<center><a href="/dashboard/contabilidad/bancos/cuentas/editar/'+b.banco_cuenta_id+'"><button type="button" class="btn btn-lg btn-outline-success m-1"><i class="fal fa-sync"></i></button></a> <button type="button" class="btn btn-lg btn-outline-danger" onClick="delCuenta(' + b.banco_cuenta_id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
        }
        
        return res.render('contabilidad/bancos/cuentas/buscar', { cuentasArray })

    } catch (error) {
        console.log(error)
    }
}










const getMoneda = async (id) => {
    try {
        const moneda = await pool.query("SELECT * FROM monedas ")
        return moneda[0]
    } catch (error) {
        console.log(error)
    }
}

const getTipoCuenta = async (id) => {
    try {
        const tipo = await pool.query("SELECT cuenta_tipo_id as ide, cuenta_tipo_descripcion as nombree FROM bancos_cuentas_tipos ")
        return tipo[0]
    } catch (error) {
        console.log(error)
    }
}
export const renderBNuevo = async(req, res) => {
    try{
        const empresaa = await getEmpresa()
        const moneda = await getMoneda()
        const tipo = await getTipoCuenta()
        res.render('contabilidad/bancos/cuentas/nueva', {empresaa, moneda, tipo})
    } catch (error) {
        console.log(error)
    }
}


export const renderBEditar = async(req, res) => {
    const {id} = req.params.id
    try {
        
        const banco = await pool.query("SELECT banco_cuenta_id, banco_cuenta_banco, banco_cuenta_numero, banco_cuenta_clabe, banco_cuenta_comentario, banco_cuenta_contacto, banco_cuenta_MM, banco_cuenta_saldo_inicial, banco_cuenta_limite_credito, banco_cuenta_moneda_id, banco_empresa_id, banco_cuenta_tipo_id, banco_cuenta_estatus_baja FROM bancos_cuentas WHERE banco_cuenta_id = ?", [req.params.id])
        const bancoinfo = banco[0][0]
        const empresaa = await getEmpresa()
        const moneda = await getMoneda()
        const tipo = await getTipoCuenta()

        res.render('contabilidad/bancos/cuentas/editar', {bancoinfo, empresaa, moneda, tipo})
    } catch (error) {
        console.log(error)
    }
}

