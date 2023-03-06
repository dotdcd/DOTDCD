import { pool } from '../../db.js'
import { getEmpresa, getSucursal, getCentrodeCosto } from '../erp/contabilidad.controller.js'
import {SW_SAPIENS_URL, SW_TOKEN} from '../../config.js'
import axios from 'axios'

//?marca
export const renderAdNuevo = async (req, res) => {
    res.render('administracion/marca/nuevo')
}

const getmarca = async (id) => {
    try {
        const marcas = await pool.query('SELECT * FROM marcas WHERE marca_id = ?', [id])
        return marcas[0][0]
    } catch (error) {
        console.log(error)
    }
}
export const renderAdEditar = async (req, res) => {

    try {
        const { id } = req.params
        const marcas = await getmarca(id)
        return res.render('administracion/marca/editar', { marcas })
    } catch (error) {
        console.log(error)
    }

}
//? marca
export const renderAdBuscar = async (req, res) => {
    try {
        let marcasArray = [] //? <- crear array con let
        const marcas = await pool.query("SELECT marca_id, marca_descripcion, marca_estatus_baja FROM marcas") //? <- consultar a la base de datos
        marcas[0].forEach(m => {
            const status = m.marca_estatus_baja == 0 ? "<span class='badge badge-success badge-pill'>Activo</span>" : "<span class='badge badge-danger badge-pill' >Inactivo</span>"
            marcasArray.push([m.marca_id, m.marca_descripcion, status, '<center><a href="/dashboard/administracion/marca/editar/' + m.marca_id + '"><button type="button" class="btn btn-lg btn-outline-success m-1" ><i class="fal fa-sync"></i></button></a>  <button type="button" onClick="delMarca(' + m.marca_id + ')" class="btn btn-lg btn-outline-danger" ><i class="fal fa-trash-alt"></i></button></center>']) //? <- agregar a array
        });

        return res.render('administracion/marca/buscar', { marcasArray }) //? <- renderizar vista
    } catch (error) {
        console.log(error)
    }
}

export const renderAdProvMarca = async (req, res) => {

    try {
        let provArray = []
        const prov = await pool.query('SELECT proveedoresxmarca_marca_id, (SELECT marca_id FROM marcas WHERE marca_id = proveedoresxmarca_marca_id) as id, proveedoresxmarca_proveedor_id, (SELECT marca_descripcion FROM marcas WHERE marca_id = proveedoresxmarca_marca_id) as nombre, (SELECT proveedor_estatus_baja FROM proveedores WHERE proveedor_id = proveedoresxmarca_proveedor_id ) as estatus, (SELECT proveedor_razon_social FROM proveedores WHERE proveedor_id = proveedoresxmarca_proveedor_id) as razon FROM marcas_proveedores')
        prov[0].forEach(p => {
            const status = (p.estatus == 0) ? "<span class='badge badge-success badge-pill'>Activo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            provArray.push([p.nombre, p.razon, status, '<center><a href="/dashboard/administracion/marca/prov_marca/nuevo"><button type="button" class="btn btn-lg btn-outline-success m-1"><i class="fal fa-light fa-plus"></i></button></a> <button type="button" class="btn btn-lg btn-outline-danger" onClick="delprovMarca(' + p.id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
        });
        res.render('administracion/marca/prov_marca', { provArray })
    } catch (error) {
        console.log(error)
    }
}

export const renderEprovMarca = async (req, res) => {
    try {
        const { id } = req.params
        const marcas = await getmarca(id)
        const proveedores = await getProveedores()
        res.render('administracion/marca/editar_prov_marca', { marcas, proveedores })
    } catch (error) {
        console.log(error)
    }
}

const getMarcas = async () => {
    try {
        const marcas = await pool.query('SELECT * FROM marcas')
        return marcas[0]
    } catch (error) {
        console.log(error)
    }
}
const getProv = async () => {
    try {
        const proveedores = await pool.query('SELECT * FROM proveedores')
        return proveedores[0]
    } catch (error) {
        console.log(error)
    }
}
export const renderAdProvMarcaNuevo = async (req, res) => {
    try {
        const marcas = await getMarcas()
        const proveedores = await getProv()
        res.render('administracion/marca/nuevo_prov_marca', { marcas, proveedores })
    } catch (error) {
        console.log(error)
    }
}

//?clientes
export const renderCliNuevo = async (req, res) => {
    const regimen_fiscal = await pool.query('SELECT * FROM regimen_fiscal')
    const rf = regimen_fiscal[0]
    const cfd = await pool.query('SELECT * FROM uso_cfdi')
    const cfdi = cfd[0]
    res.render('administracion/clientes/nuevo', { rf, cfdi })
}

export const renderCliBuscar = async (req, res) => {
    let cliArray = []
    const cli = await pool.query("SELECT cliente_id, IF(cliente_razon_social = '', 'SIN AGREGAR', cliente_razon_social) as rsocial, IF(cliente_rfc = '', 'SIN AGREGAR', cliente_rfc) as rfc, IF(cliente_calle = '', 'SIN AGREGAR' , cliente_calle) as calle, IF(cliente_email = '', 'SIN AGREGAR', cliente_email) as email, IF(cliente_colonia = '', 'SIN AGREGAR', cliente_colonia) as colonia, IF(cliente_municipio = '', 'SIN AGREGAR', cliente_municipio) as municipio, IF(cliente_estado = '', 'SIN AGREGAR', cliente_estado) as estado, IF(cliente_codigo_postal = 0, 'pendiente', cliente_codigo_postal) as cp, IF(cliente_telefono = '', 'SIN AGREGAR', cliente_telefono) as telefono, IF(cliente_contacto = '', 'SIN AGREGAR', cliente_contacto) as contacto, IF(cliente_cobranza = '', 'SIN AGREGAR', cliente_cobranza) as cobranza, cliente_estatus_baja FROM clientes")
    cli[0].forEach(c => {
        const clstatus = (c.cliente_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
        cliArray.push([c.rsocial, c.rfc, c.calle, c.colonia, c.municipio, c.estado, c.cp, c.telefono, c.contacto, c.email, c.cobranza, clstatus, '<center><a href="/dashboard/administracion/clientes/editar/' + c.cliente_id + '" class="btn btn-lg btn-outline-success m-1""><i class="fal fa-sync"></i></a><button type="button" class="btn btn-lg btn-outline-danger" onClick="delCliente(' + c.cliente_id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
    });

    res.render('administracion/clientes/buscar', { cliArray })
}

//* Editar cliente
const getCliente = async (id) => {
    try {

        const cliente = await pool.query('SELECT * FROM clientes WHERE cliente_id = ?', [id])
        return cliente[0][0]
    } catch (error) {
        console.log(error)
    }
}
export const renderCliEditar = async (req, res) => {
    try {
        const cliente = await getCliente(req.params.id)
        const regimen_fiscal = await pool.query('SELECT * FROM regimen_fiscal')
        const rf = regimen_fiscal[0]
        const cfd = await pool.query('SELECT * FROM uso_cfdi')
        const cfdi = cfd[0]
        res.render('administracion/clientes/editar', { cliente, rf, cfdi })
    } catch (error) {
        console.log(error)
    }
}
//! fin editar cliente


//? render Programar prefacturas page
const getClientes = async () => {
    const customers = await pool.query('SELECT * FROM clientes')
    return customers[0]
}

const getInversion = async () => {
    const inversion = await pool.query('SELECT * FROM inversiones')
    return inversion[0]
}

const getCotizacion = async () => {
    const cotizaciones = await pool.query("SELECT cotizacion_id, CONCAT(cotizacion_proyecto,' - ', cliente_razon_social) AS nombre FROM cotizaciones JOIN clientes ON cotizacion_cliente_id = cliente_id WHERE cotizacion_autorizada_estatus > 0 ORDER BY cotizacion_id DESC")
    let cotizacion = []
    for (const i of cotizaciones[0]) {
        cotizacion.push([i.cotizacion_id, i.nombre, '<input value="' + i.cotizacion_id + '" type="radio" name="factura_proyecto_id" class="form-control"/>'])
    }
    return {cotizacion, cotizaciones: cotizaciones[0]}
}

const getFolios = async () => {
    const folios = await pool.query('SELECT folio_id, folio_descripcion FROM folios')
    return folios[0]
}

const getPrefacturaRemision = async () => {
    const remision = await pool.query('SELECT remisionfactura_id, remisionfactura_descripcion FROM remisionfactura')
    return remision[0]
}

const getMoneda = async () => {
    const moneda = await pool.query('SELECT moneda_id, moneda_descripcion, moneda_cotizacion FROM monedas')
    return moneda[0]
}

const getFactura = async () => {
    const factura = await pool.query('SELECT tipo_venta, uso_cfdi FROM facturas')
    return factura[0]
}

const vPrefacturaProgramada = async () => {
    try {
        const prefacturas = await pool.query("SELECT f.factura_id as id, CONCAT('(', c.cotizacion_id, ')', ' - ', c.cotizacion_proyecto, '	' )  as proyectos,  CONCAT('$', f.factura_total) as total, f.dia_facturacion as dia ,f.meses_facturar AS meses FROM cotizaciones AS c JOIN facturas_programadas AS f ON c.cotizacion_id = f.factura_proyecto_id GROUP BY id")
        let prefactura = []
        for (const i of prefacturas[0]) {
            prefactura.push([i.id, i.proyectos, i.total, i.dia, i.meses, '<button class="btn btn-outline-info" onclick="updPrefactura(' + i.id + ')"><i class="fas fa-edit"></i></button> <button class="btn btn-outline-danger" onclick="' + i.id + '"><i class="fas fa-trash-alt"></i></button>'])
        }
        return prefactura
    } catch (error) {
        console.log(error)
    }
}

const vPrefactura = async () => {
    try {
        const prefacturas = await pool.query("SELECT f.factura_id as id, CONCAT('(', c.cotizacion_id, ')', ' - ', c.cotizacion_proyecto, '	' )  as proyectos,  CONCAT('$', f.factura_total) as total FROM cotizaciones AS c JOIN facturas AS f ON c.cotizacion_id = f.factura_proyecto_id GROUP BY id")
        let prefactura = []
        for (const i of prefacturas[0]) {
            prefactura.push([i.id, i.proyectos, i.total, '<button class="btn btn-outline-info" onclick="updPrefactura(' + i.id + ')"><i class="fas fa-edit"></i></button> <button class="btn btn-outline-danger" onclick="' + i.id + '"><i class="fas fa-trash-alt"></i></button>'])
        }
        return prefactura
    } catch (error) {
        console.log(error)
    }
}





export const renderProgPrefacturar = async (req, res) => {
    try {
        const sucursal = await getSucursal()
        const empresa = await getEmpresa()
        const centroCostos = await getCentrodeCosto()
        const cliente = await getClientes()
        const inversion = await getInversion()
        const proyecto = await getCotizacion()
        const folios = await getFolios()
        const remision = await getPrefacturaRemision()
        const moneda = await getMoneda()
        const tipoVenta = await getFactura()
        const pPrefacturas = await vPrefactura()

        const cotizacion = proyecto.cotizacion
        const empresaF = getcurrentEmpresa()
        return res.render('administracion/facturasprefacturas/programarPrefactura', { sucursal, empresa, centroCostos, cliente, inversion, cotizacion, folios, remision, moneda, tipoVenta, pPrefacturas })
    } catch (error) {
        console.log(error)
    }
}
//! End render

//? Falta obtener la empresa actual para hacer la factura

export const getcurrentEmpresa = () => {
    const empresa = pool.query('SELECT cheque_empresa_id FROM cheques WHERE cheque_id ')
    return empresa[0][0].empresa_id
}
//? Render prefacturar view

export const renderPrefacturas = async (req, res) => {
    try {
        const sucursal = await getSucursal()
        const empresa = await getEmpresa()
        const centroCostos = await getCentrodeCosto()
        const cliente = await getClientes()
        const inversion = await getInversion()
        const proyecto = await getCotizacion()
        const folios = await getFolios()
        const remision = await getPrefacturaRemision()
        const moneda = await getMoneda()
        const tipoVenta = await getFactura()
        const cotizacion = proyecto.cotizacion
        return res.render('administracion/facturasprefacturas/prefacturar', { sucursal, empresa, centroCostos, cliente, inversion, cotizacion, folios, remision, moneda, tipoVenta })
    } catch (error) {

    }
}

//! End render prefacturar view

//? Render prefacturas view

export const renderVerPrefacturas = async (req, res) => {
    try {
        const pPrefacturas = await vPrefactura()
        const pPrefacturasProgramadas = await vPrefacturaProgramada()
        return res.render('administracion/facturasprefacturas/verPrefacturas', { pPrefacturas, pPrefacturasProgramadas })
    } catch (error) {
        console.log(error)
    }
}

//! En render prefacturas view

//? Render Update prefactura view

const getPprefactura = async (id) => {
    const prefactura = await pool.query('SELECT * FROM facturas_programadas WHERE factura_id = ?', [id])
    return prefactura[0][0]
}

const getProyecto = async (id) => {
    const proyecto = await pool.query('SELECT * FROM cotizaciones WHERE cotizacion_id = ?', [id])
    return proyecto[0][0]
}

export const renderVerPprefactura = async (req, res) => {
    try {
        const prefactura = await getPprefactura(req.params.id)
        const sucursal = await getSucursal()
        const empresa = await getEmpresa()
        const centroCostos = await getCentrodeCosto()
        const cliente = await getClientes()
        const inversion = await getInversion()
        const cotizacion = await getCotizacion()
        const folios = await getFolios()
        const remision = await getPrefacturaRemision()
        const moneda = await getMoneda()
        const tipoVenta = await getFactura()
        const proyecto = await getProyecto()
        return res.render('administracion/facturasprefacturas/editar', { prefactura, descripcion, proyecto, sucursal, empresa, centroCostos, cliente, inversion, cotizacion, folios, remision, moneda, tipoVenta })
    } catch (error) {
        console.log(error)
    }
}

//! End render prefactura view

//?proveedores
export const renderPBNuevo = async (req, res) => {
    res.render('administracion/proveedores/nuevo')
}

export const renderPBBuscar = async (req, res) => {
    try {
        let provBuscar = []
        const prov = await pool.query('SELECT proveedor_id, IF(proveedor_razon_social = "", "SIN AGREGAR", proveedor_razon_social ) as proveedor_razon_social , IF(proveedor_contacto = "", "SIN AGREGAR", proveedor_contacto) as proveedor_contacto,  IF(proveedor_contacto_email = "", "SIN AGREGAR", proveedor_contacto_email) AS proveedor_contacto_email, IF(proveedor_telefono = "", "SIN AGREGAR", proveedor_telefono) AS proveedor_telefono, IF(proveedor_direccion = "", "SIN AGREGAR", proveedor_direccion) AS proveedor_direccion, IF(proveedor_rfc = "", "SIN AGREGAR", proveedor_rfc) AS proveedor_rfc,  IF(proveedor_web = "", "SIN AGREGAR", proveedor_web) AS proveedor_web, IF(proveedor_usuario_password = "", "SIN AGREGAR", proveedor_usuario_password) AS proveedor_usuario_password,  IF(proveedor_dias_credito = "", "SIN AGREGAR", proveedor_dias_credito) AS proveedor_dias_credito,  IF(proveedor_limite_credito = "", "SIN AGREGAR", proveedor_limite_credito) AS proveedor_limite_credito, IF(proveedor_tipo_id = "", "SIN AGREGAR", proveedor_tipo_id) AS proveedor_tipo_id, proveedor_estatus_baja FROM proveedores')
        for (const p of prov[0]) {
            const cstatus = (p.proveedor_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            provBuscar.push([p.proveedor_razon_social, p.proveedor_contacto, p.proveedor_contacto_email, p.proveedor_telefono, p.proveedor_direccion, p.proveedor_rfc, p.proveedor_web, p.proveedor_usuario_password, p.proveedor_dias_credito, p.proveedor_limite_credito, p.proveedor_tipo_id, cstatus, '<center><a  href="/dashboard/administracion/proveedores/editar/' + p.proveedor_id + '"  class="btn btn-lg btn-outline-success m-1"><i class="fal fa-sync"></i></a>  <button onclick="delProveedor(' + p.proveedor_id + ')" type="button" class="btn btn-lg btn-outline-danger"><i class="fal fa-trash-alt"></i></button></center>'])
        }
        return res.render('administracion/proveedores/buscar', { provBuscar })

    } catch (error) {
        console.log(error)
    }
}

const getProveedores = async (id) => {
    try {
        const proveedores = await pool.query('SELECT * FROM proveedores WHERE proveedor_id = ?', [id])
        return proveedores[0][0]
    } catch (error) {
        console.log(error)
    }
}

export const renderPBEditar = async (req, res) => {
    try {
        const proveedores = await getProveedores(req.params.id)
        return res.render('administracion/proveedores/editar', { proveedores })
    } catch (error) {
        console.log(error)
    }
}

//! End proveedores

export const renderDCNuevo = async (req, res) => {
    res.render('administracion/disciplina/nueva')
}

export const renderDCBuscar = async (req, res) => {
    //! Buenas practicas
    try {
        let disciplinaArray = []
        const dic = await pool.query('SELECT * FROM familias')
        for (const d of dic[0]) {
            const cstatus = (d.familia_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            disciplinaArray.push([d.familia_clave, d.familia_descripcion, cstatus, '<center><a href="/dashboard/administracion/disciplina/editar/' + d.familia_id + '" class="btn btn-lg btn-outline-success m-1" "><i class="fal fa-sync"></i></a>  <button type="button" class="btn btn-lg btn-outline-danger" onClick="delDisciplina(' + d.familia_id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
        }

        return res.render('administracion/disciplina/buscar', { disciplinaArray })
    } catch (error) {
        console.log(error)
    }
}


const getDisciplina = async (id) => {
    const disciplina = await pool.query('SELECT * FROM familias WHERE familia_id = ?', [id])
    return disciplina[0][0]
}
export const renderDCEditar = async (req, res) => {
    try {
        const { id } = req.params
        const disciplina = await getDisciplina(id)
        return res.render('administracion/disciplina/editar', { disciplina })
    } catch (error) {
        console.log(error)
    }
}

//! End render proveedores


//? render disciplinas
export const renderDiNuevo = async (req, res) => {
    res.render('administracion/disciplinas/nueva')
}

export const renderDiBuscar = async (req, res) => {
    res.render('administracion/disciplinas/buscar')
}
//! End render disciplinas



//? Render Dispositivos

export const renderDnuevo = async (req, res) => {
    const familias = await pool.query('SELECT * FROM familias')
    const cable = await pool.query('SELECT * FROM cable')
        
        const f = familias[0]
        const c = cable[0]
        const lista = await getLista()


    res.render('administracion/dispositivos/nuevo', {  f, c, lista  })
}

const getDispositivo = async () => {
    const dispositivo = await pool.query('SELECT * FROM dispositivo')
    return dispositivo[0]
}

export const renderDbuscar = async (req, res) => {
    let disaa = []

    try {
        const dispo = await pool.query('SELECT d.dispositivo_id, d.clave, d.descripcion, d.rendimiento_hr, d.rendimiento_min, f.familia_descripcion as familia, d.dispositivo_estatus_baja, ca.descripcion as cable_a, cb.descripcion as cable_b FROM dispositivo d INNER JOIN familias f ON f.familia_id = d.familia_id INNER JOIN cable ca ON ca.cable_id = d.cable_idA INNER JOIN cable cb ON cb.cable_id = d.cable_idB')
        for (const d of dispo[0]) {
            const cstatus = (d.dispositivo_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            disaa.push([d.descripcion, d.clave, d.rendimiento_hr + ' : ' + d.rendimiento_min, d.familia, d.cable_a, d.cable_b, cstatus, '<center><a href="/dashboard/administracion/dispositivos/editar/' + d.dispositivo_id + '" class="btn btn-lg btn-outline-success m-1" "><i class="fal fa-sync"></i></a>  <form action="/delDispositivo/'+d.dispositivo_id+'" method="post"><button type="submit" class="btn btn-lg btn-outline-danger" ><i class="fal fa-trash-alt"></i></button></form></center>'])
        }
        return res.render('administracion/dispositivos/buscar', { disaa })
    }
    catch (error) {
        console.log(error)
    }
}
//! End render dispositivos


//?render Cables
export const renderCnuevo = async (req, res) => {
    res.render('administracion/cables/nuevo')
}

export const renderCbuscar = async (req, res) => {
    try {
        let cableArray = []
        const cable = await pool.query('SELECT cable_id, clave, descripcion, cable_estatus_baja FROM cable')
        for (const c of cable[0]) {
            const cstatus = (c.cable_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            cableArray.push([c.clave, c.descripcion, cstatus, '<center><a href="/dashboard/administracion/cables/editar/' + c.cable_id + '" class="btn btn-lg btn-outline-success m-1" ><i class="fal fa-sync"></i></a>  <button type="button" class="btn btn-lg btn-outline-danger" onClick="delCable(' + c.cable_id + ')"><i class="fal fa-trash-alt"></i></button><center>'])
        }
        return res.render('administracion/cables/buscar', { cableArray })
    } catch (error) {
        console.log(error)
    }
}

const getCable = async (id) => {
    try {
        const cable = await pool.query('SELECT * FROM cable WHERE cable_id = ?', [id])
        return cable[0][0]
    } catch (error) {
        console.log(error)
    }
}


export const renderCeditar = async (req, res) => {
    try {
        const { id } = req.params

        const cable = await getCable(id)
        return res.render('administracion/cables/editar', { cable })
    } catch (error) {
        console.log(error)
    }
}
//! End render cables 

//? Render Facturas 

const vfactura = async () => {
    try {
        const prefacturas = await pool.query("SELECT f.factura_id as id, CONCAT('(', c.cotizacion_id, ')', ' - ', c.cotizacion_proyecto, '	' )  as proyectos,  CONCAT('$', f.factura_total) as total FROM cotizaciones AS c JOIN facturas AS f ON c.cotizacion_id = f.factura_proyecto_id GROUP BY id")
        let prefactura = []
        for (const i of prefacturas[0]) {
            prefactura.push([i.id, i.proyectos, i.total, '<a class="btn btn-outline-info" href="/dashboard/administracion/facturas/' + i.id + '"><i class="fas fa-edit"></i></a>'])
        }
        return prefactura
    } catch (error) {
        console.log(error)
    }
}

const getPreF = async () => {
    try {
        const prefactura = await pool.query('SELECT * FROM prefacturas')
        const proy = []
        for (const p of prefactura[0]) {
            const cotizaciones = await pool.query('SELECT * FROM prefacturas_proyectos WHERE prefactura_id = ?', [p.prefactura_id])
            proy.push([p.prefactura_id, cotizaciones[0]])
        }
        return proy
    } catch (error) {
        console.log(error)
    }
}

export const renderFacturas = async (req, res) => {
    try {
        const facturas = await vfactura()
        const prefacturas = await getPreF()
        console.log(prefacturas)
        return res.render('administracion/facturas/facturas', { facturas })
    } catch (error) {
        console.log(error)
    }
}

//! Render Facturas

const getClaveProducto = async () => {
    try {
        const clave = await pool.query('SELECT UPPER(id_sat) as id_sat, UPPER(servicio) as servicio, UPPER(empresa) as empresa FROM catalogo_servicio')
        return clave[0]
    } catch (error) {
        console.log(error)
    }
}

const getUsosCfdi = async () => {
    try {
        const usos = await pool.query('SELECT * FROM uso_cfdi')
        return usos[0]
    } catch (error) {
        console.log(error)
    }
}

const getUnidades = async () => {
    try {
        const unidades = await pool.query('SELECT * FROM unidades_sat')
        return unidades[0]
    } catch (error) {
        console.log(error)
    }
}

//?obtener valor en tiempo real 

//? Render Facturar



export const renderFacturar = async (req, res) => {
    try {
        const sucursal = await getSucursal()
        const empresa = await getEmpresa()
        const centroCostos = await getCentrodeCosto()
        const cliente = await getClientes()
        const inversion = await getInversion()
        const proyecto = await getCotizacion()
        const folios = await getFolios()
        const remision = await getPrefacturaRemision()
        const moneda = await getMoneda()
        const tipoVenta = await getFactura()
        const catalogo = await getClaveProducto()
        const usos = await getUsosCfdi()
        const unidades = await getUnidades()
        
        const cotizacion = proyecto.cotizacion

        return res.render('administracion/facturas/facturar', { sucursal, empresa, centroCostos, cliente, inversion, cotizacion, folios, remision, moneda, tipoVenta, catalogo, usos, unidades })
    } catch (error) {
        console.log(error)
    }
}
//! End render facturar

//? Render ver Factura
const getTimbrado = async (id) => {
    try {
        const timbrado = await pool.query('SELECT * FROM facturas WHERE factura_id = ?', [id])
        return timbrado[0][0]
    } catch (error) {
        console.log(error)
    }
}

const getXml = async (uuid) => {
    try {
        const response = await axios.get(SW_SAPIENS_URL+'/datawarehouse/v1/live/' + uuid, {
            headers: {
                'Authorization': `Bearer ${SW_TOKEN}`
            }
        })
        return response.data.data.records[0].urlXml

    } catch (error) {
        console.log(error)
    }
}

const getPagos = async () => {
    try {
        const pagos = await pool.query('SELECT * FROM formas_pago')
        return pagos[0]
    } catch (error) {
        console.log(error)
    }
}

export const verFactura = async (req, res) => {
    try {
        const sucursal = await getSucursal()
        const empresa = await getEmpresa()
        const centroCostos = await getCentrodeCosto()
        const cliente = await getClientes()
        const inversion = await getInversion()
        const proyecto = await getCotizacion()
        const folios = await getFolios()
        const remision = await getPrefacturaRemision()
        const moneda = await getMoneda()
        const tipoVenta = await getFactura()
        const prefactura = await getTimbrado(req.params.id)
        const xml = await getXml(prefactura.uuid)
        const cotizacion = proyecto.cotizaciones
        const pagos = await getPagos()
        
        return res.render('administracion/facturas/ver', { sucursal, empresa, centroCostos, cliente, inversion, cotizacion, folios, remision, moneda, tipoVenta, prefactura, xml, pagos })
    } catch (error) {
        console.log(error)
    }
}
//! End render ver factura

//? render factura pdf

const getTaxInfo = async (id) => {
    try {
        const timbrado = await pool.query('SELECT f.factura_empresa_id as empresa, f.factura_cliente_id, f.factura_descripcion as descripcion, f.uso_cfdi, DATE_FORMAT(f.factura_fecha_alta, "%d/%b/%Y") as factura_fecha_alta, f.forma_pago, f.mpago, f.cadena_sat, f.uuid, f.sello_sat, f.sello_cfdi, f.qr, f.factura_factura, f.factura_subtotal, f.factura_iva, f.factura_total, f.factura_c_unidad, f.factura_clave_prod, emp.empresa_razon_social, mon.moneda_descripcion, f.tipo_cambio FROM facturas f JOIN multiempresa emp ON f.factura_empresa_id = emp.empresa_id JOIN monedas mon ON f.factura_moneda_id = mon.moneda_id WHERE f.factura_id = ?', [id]) 
        return timbrado[0][0]
    } catch (error) {
        console.log(error)
    }
}

const getClientInfo = async (id) => {
    try {
        const cliente = await pool.query('SELECT * FROM clientes WHERE cliente_id = ?', [id])
        return cliente[0][0]
    } catch (error) {
        console.log(error)
    }
}

const getEmpresaInfo = async (id) => {
    try {
        const empresa = await pool.query('SELECT * FROM multiempresa WHERE empresa_id = ?', [id])
        return empresa[0][0]
    } catch (error) {
        console.log(error)
    }
}

const getFormaPago = async (id) => {
    try {
        const formaPago = await pool.query('SELECT * FROM formas_pago WHERE id = ?', [id])
        return formaPago[0][0]
    } catch (error) {
        console.log(error)
    }
}

export const renderTaxPdf = async (req, res) => {
    try {
        const { id } = req.params
        const taxInfo = await getTaxInfo(id)
        const cliente = await getClientInfo(taxInfo.factura_cliente_id)
        const empresa = await getEmpresaInfo(taxInfo.empresa)
        const formaPago = await getFormaPago(taxInfo.forma_pago)
        console.log(taxInfo)
        return res.render('administracion/facturas/pdf', { taxInfo, cliente, empresa, formaPago })
    } catch (error) {
        console.log(error)
    }
}

//! end render factura pdf

const getDispositivoC = async (id) => {
    try {
        const dispositivo = await pool.query('SELECT * FROM dispositivo WHERE dispositivo_id = ' + id)
        return dispositivo[0][0]
    } catch (error) {
        console.log(error)
    }
}

const getComponentes = async (id) => {
    try {
        const componentes = await pool.query('SELECT * FROM dispositivo_componentes WHERE dispositivo_id =' + id)
        return componentes[0]

    } catch (error) {
        console.log(error)
    }
}
const getLista = async () => {
    try {
        const lista = await pool.query('SELECT * FROM componentes WHERE activo = 1')
        return lista[0]
    } catch (error) {
        console.log(error)
    }
}

const getSelected = async (id) => {
    try{
        const selected = await pool.query("SELECT c.componente_id, componente_nombre, CASE WHEN dispositivo_id > 0 THEN 1 ELSE 0 END as activo, ifnull(pc.rendimiento_hr, 0) as rendimiento_hr, ifnull(pc.rendimiento_min, 0) as rendimiento_min, ifnull(NULLIF(pc.costo, ''), 0) as costo FROM componentes c LEFT JOIN dispositivo_componentes pc ON pc.componente_id = c.componente_id AND pc.dispositivo_id ="+ id+" WHERE c.activo = 1 order by componente_id")
        return selected[0]
    }
    catch(error){
        console.log(error)
    }
}

export const renderDeditar = async (req, res) => {
    try {
        const d = await getDispositivoC(req.params.id)
        const familias = await pool.query('SELECT * FROM familias')
        const cable = await pool.query('SELECT * FROM cable')
        const componentes = await getComponentes(req.params.id)
        const f = familias[0]
        const c = cable[0]
        const lista = await getLista()
        const selected = await getSelected(req.params.id)
        return res.render('administracion/dispositivos/editar', { d, f, c, componentes, lista, selected })
    } catch (error) {
        console.log(error)
    }
}



//? render Productos y servicios
const getProductos = async () => {
    try {
        const productos = await pool.query('SELECT producto_id, producto_codigo, producto_descripcion, producto_tipo_id, producto_material_tipo, producto_familia_id, producto_modelo, producto_marca_id, producto_ficha_tecnica_path, producto_unidad_id, producto_moneda_id, producto_costo, producto_mo, producto_costo_fecha, producto_icampo, producto_ioficina, producto_hm, producto_financiero, producto_utilidad, producto_precio_venta, producto_serie_id, producto_precio_tarjeta, producto_fecha_alta, producto_fecha_baja, producto_ultima_modificacion, producto_estatus_baja, moneda_id, moneda_descripcion, moneda_cotizacion, dispositivo_id, usuario_modifico FROM productos JOIN monedas ON moneda_id = producto_moneda_id ORDER BY `productos`.`producto_id` DESC')
        return productos[0]
    } catch (error) {
        console.log(error)
    }
}
export const renderProdBuscar = async (req, res) => {
    try {
        let parray = []
        const jornada = await pool.query("SELECT SUM((jornada_costo * jornada_porcentaje) / 100) AS costo_jornada, moneda_cotizacion FROM jornadas LEFT JOIN monedas ON moneda_id = 2")

        const productos = await pool.query('SELECT p.producto_id as producto_idw, p.producto_descripcion, p.producto_icampo as icampo, p.producto_ioficina as ioficina, p.producto_hm as hm, p.producto_financiero as financiero, p.producto_utilidad as utilidad, p.producto_ultima_modificacion, p.usuario_modifico, d.descripcion as dispositivo, p.producto_codigo, p.producto_tipo_id, tm.tm_tipo as tipo, s.serie_descripcion as serie, p.producto_familia_id, f.familia_clave as familias, p.producto_modelo, p.producto_marca_id, m.marca_descripcion as marca, p.producto_unidad_id, u.unidad_descripcion as unidad, mn.moneda_descripcion as moneda, mn.moneda_cotizacion as Mcot, p.producto_costo, p.producto_costo_fecha, p.producto_precio_tarjeta, p.producto_mo, p.producto_precio_venta, p.producto_estatus_baja as baja FROM productos p  INNER JOIN dispositivo d ON d.dispositivo_id = p.dispositivo_id  INNER JOIN tipos_material tm ON tm.tm_id = p.producto_tipo_id  INNER JOIN serie s ON s.serie_id = producto_serie_id  INNER JOIN familias f ON f.familia_id = p.producto_familia_id  INNER JOIN marcas m ON m.marca_id = p.producto_marca_id  INNER JOIN unidades u ON u.unidad_id = p.producto_unidad_id  INNER JOIN monedas mn ON mn.moneda_id = p.producto_moneda_id ORDER BY p.producto_id DESC')
        for (const pr of productos[0]) {
            const cstatus = (pr.producto_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'></span>"
            parray.push([pr.producto_descripcion, pr.producto_codigo, pr.tipo, pr.familias, pr.dispositivo, pr.producto_modelo, pr.marca, pr.unidad, pr.serie, pr.moneda, pr.producto_costo, pr.producto_costo_fecha, pr.producto_precio_tarjeta, pr.producto_mo, cstatus, pr.producto_ultima_modificacion, pr.utilidad, pr.icampo, pr.ioficina, pr.hm, pr.financiero, '<center><a href="/dashboard/administracion/productos/editar/' + pr.producto_idw + '" class="btn btn-lg btn-outline-success m-1" ><i class="fal fa-sync"></i></a>  <form method="post" action="/delProducto/' + pr.producto_idw + '"> <button type="submit" class="btn btn-lg btn-outline-danger"><i class="fal fa-light fa-circle-minus"></i></button></form><center> <p> <button class="btn btn-primary" type="button" data-toggle="collapse"data-target="#collapseExample" aria-expanded="false" onclick="calcular(' + pr.producto_precio_tarjeta + ',' + pr.utilidad + ',' + pr.icampo + ',' + pr.ioficina + ',' + pr.hm + ',' + pr.financiero + ',' + pr.producto_mo + ',' + pr.Mcot + ')" aria-controls="collapseExample">Tabla de Ìndices</button></p>'])
        }

        return res.render('administracion/productos/buscar', { parray })
    } catch (error) {
        console.log(error)
    }
}

const getFamilias = async () => {
    try {
        const familias = await pool.query('SELECT familia_id, familia_clave, familia_descripcion FROM familias')
        return familias[0]
    } catch (error) {
        console.log(error)
    }
}

const getDispositivos = async () => {
    try {
        const dispositivos = await pool.query('SELECT dispositivo_id, descripcion FROM dispositivo')
        return dispositivos[0]
    } catch (error) {
        console.log(error)
    }
}

const getTipo = async () => {
    try {
        const tipo = await pool.query('SELECT * FROM tipos_insumo')
        return tipo[0]
    } catch (error) {
        console.log(error)
    }
}

export const renderProdNuevo = async (req, res) => {
    try {
        const moneda = await getMoneda()
        const dispositivo = await getDispositivos()
        const familia = await getFamilias()
        const marca = await getMarcas()
        const tipo = await getTipo()
        return res.render('administracion/productos/nuevo', { moneda, dispositivo, familia, marca, tipo })
    } catch (error) {
        console.log(error)
    }
}

const getProducto = async (id) => {
    try {
        const producto = await pool.query('SELECT producto_id, producto_descripcion,producto_material_tipo, FORMAT (producto_costo_fecha, "dd-MM-yy") as producto_costo_fecha, producto_serie_id, dispositivo_id, producto_codigo, producto_tipo_id, producto_familia_id, producto_modelo, producto_marca_id, producto_unidad_id, producto_moneda_id, producto_costo, producto_costo_fecha, producto_precio_tarjeta, producto_mo, producto_precio_venta, producto_estatus_baja, producto_hm, producto_ioficina, producto_icampo, producto_financiero, producto_utilidad FROM productos WHERE producto_id = ?', [id])

        return producto[0][0]
    } catch (error) {
        console.log(error)
    }
}

const getUnidad = async () => {
    try {
        const unidad = await pool.query('SELECT unidad_id, unidad_descripcion FROM unidades')
        return unidad[0]
    } catch (error) {
        console.log(error)
    }
}

const getSeries = async () => {
    try {
        const series = await pool.query('SELECT serie_id, serie_descripcion FROM serie')
        return series[0]
    } catch (error) {
        console.log(error)
    }
}
const getMaterial = async () => {
    try {
        const material = await pool.query('SELECT tm_id, tm_tipo FROM tipos_material')
        return material[0]
    } catch (error) {
        console.log(error)
    }
}

const tipe = async () => {
    try {
        const tipo = await pool.query('SELECT tipo_id, tipo_descripcion FROM tipos_insumo')
        return tipo[0]
    } catch (error) {
        console.log(error)
    }
}
export const renderProdEditar = async (req, res) => {
    try {
        const { id } = req.params.id
        const producto = await getProducto(req.params.id)
        const moneda = await getMoneda()
        const dispositivo = await getDispositivos()
        const familia = await getFamilias()
        const marca = await getMarcas()
        const unidad = await getUnidad()
        const serie = await getSeries()
        const material = await getMaterial()
        const tipo = await tipe()
        return res.render('administracion/productos/editar', { producto, moneda, dispositivo, familia, marca, unidad, serie, material, tipo })
    } catch (error) {
        console.log(error)
    }
}