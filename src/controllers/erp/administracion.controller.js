import { pool } from '../../db.js'
import {getEmpresa, getSucursal, getCentrodeCosto} from '../erp/contabilidad.controller.js'

//?marca
export const renderAdNuevo = async (req, res) => {
    res.render('administracion/marca/nuevo')
}

//? marca
export const renderAdBuscar = async (req, res) => {
    try {
        let marcasArray = [] //? <- crear array con let
        const marcas = await pool.query("SELECT marca_id, marca_descripcion, marca_estatus_baja as marca_status FROM marcas") //? <- consultar a la base de datos
        marcas[0].forEach(m => {
            const status = m.marca_status == 0 ? "<span class='badge badge-success badge-pill'>Activo</span>" : "<span class='badge badge-danger badge-pill' >Inactivo</span>"
            marcasArray.push([m.marca_id, m.marca_descripcion, status, '<center><button type="button" class="btn btn-lg btn-outline-success mr-5" onClick="showModalPut({id: '+m.marca_id+', marca_descripcion: '+"'"+m.marca_descripcion+"'"+', marca_estatus: '+m.marca_status+'})"><i class="fal fa-sync"></i></button>  <button type="button" class="btn btn-lg btn-outline-danger" onClick="showModalDel('+m.marca_id+')"><i class="fal fa-trash-alt"></i></button></center>']) //? <- agregar a array
        });
    
        return res.render('administracion/marca/buscar', {marcasArray}) //? <- renderizar vista
    } catch (error) {
        console.log(error)
    }
}

export const renderAdProvMarca = async (req, res) => {

    let provArray = []
    const prov = await  pool.query('SELECT m.marca_descripcion as marca, p.proveedor_razon_social as proveedor, p.proveedor_estatus_baja as estatus FROM marcas_proveedores mp INNER JOIN marcas m ON m.marca_id = mp.proveedoresxmarca_marca_id INNER JOIN proveedores p ON p.proveedor_id = mp.proveedoresxmarca_marca_id')
    prov[0].forEach(p => {
        const status = (p.prov_status == 1) ? 'Inactivo' : 'Activo'
        provArray.push([p.marca, p.proveedor, status])
    });
    res.render('administracion/marca/prov_marca', {provArray})
}

//?clientes
export const renderCliNuevo = async (req, res) => {
    
    res.render('administracion/clientes/nuevo')
}

export const renderCliBuscar = async (req, res) => {
    let cliArray = []
    const cli = await pool.query("SELECT IF(cliente_razon_social = '', 'SIN AGREGAR', cliente_razon_social) as rsocial, IF(cliente_rfc = '', 'SIN AGREGAR', cliente_rfc) as rfc, IF(cliente_calle = '', 'SIN AGREGAR' , cliente_calle) as calle, IF(cliente_colonia = '', 'SIN AGREGAR', cliente_colonia) as colonia, IF(cliente_municipio = '', 'SIN AGREGAR', cliente_municipio) as municipio, IF(cliente_estado = '', 'SIN AGREGAR', cliente_estado) as estado, IF(cliente_codigo_postal = 0, 'pendiente', cliente_codigo_postal) as cp, IF(cliente_telefono = '', 'SIN AGREGAR', cliente_telefono) as telefono, IF(cliente_contacto = '', 'SIN AGREGAR', cliente_contacto) as contacto, IF(cliente_cobranza = '', 'SIN AGREGAR', cliente_cobranza) as cobranza, IF(cliente_estatus_baja = NULL, 'SIN AGREGAR', cliente_estatus_baja) as estatus FROM clientes")
    cli[0].forEach(c => {
        const cstatus = (c.status == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
        cliArray.push([c.rsocial, c.rfc, c.calle, c.colonia, c.municipio, c.estado, c.cp, c.telefono, c.contacto, c.cobranza, cstatus])
    });

    res.render('administracion/clientes/buscar', {cliArray})
}

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
    const cotizacion = await pool.query("SELECT cotizacion_id, CONCAT(cotizacion_proyecto,' - ', cliente_razon_social) AS nombre FROM cotizaciones JOIN clientes ON cotizacion_cliente_id = cliente_id WHERE cotizacion_autorizada_estatus > 0 ORDER BY cotizacion_id DESC")
    let cotizaciones = []
    for (const i of cotizacion[0]) {
        cotizaciones.push([i.cotizacion_id, i.nombre, '<input value="'+i.cotizacion_id+'" type="radio" name="factura_proyecto_id" class="form-control"/>'])
    }
    return cotizaciones
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
    const factura = await pool.query('SELECT tipo_venta FROM facturas')
    return factura[0]
}

const  vPrefacturaProgramada= async () => {
    try {
        const prefacturas = await pool.query("SELECT f.factura_id as id, CONCAT('(', c.cotizacion_id, ')', ' - ', c.cotizacion_proyecto, '	' )  as proyectos,  CONCAT('$', f.factura_total) as total, f.dia_facturacion as dia ,f.meses_facturar AS meses FROM cotizaciones AS c JOIN facturas_programadas AS f ON c.cotizacion_id = f.factura_proyecto_id GROUP BY id")
        let prefactura = []
        for (const i of prefacturas[0]) {
            prefactura.push([i.id, i.proyectos, i.total, i.dia, i.meses,'<button class="btn btn-outline-info" onclick="updPrefactura('+i.id+')"><i class="fas fa-edit"></i></button> <button class="btn btn-outline-danger" onclick="'+i.id+'"><i class="fas fa-trash-alt"></i></button>'])
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
            prefactura.push([i.id, i.proyectos, i.total, '<button class="btn btn-outline-info" onclick="updPrefactura('+i.id+')"><i class="fas fa-edit"></i></button> <button class="btn btn-outline-danger" onclick="'+i.id+'"><i class="fas fa-trash-alt"></i></button>'])
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
        const cotizacion = await getCotizacion()
        const folios = await getFolios()
        const remision = await getPrefacturaRemision()
        const moneda = await getMoneda()
        const tipoVenta = await getFactura()
        const pPrefacturas = await vPrefactura()

        return res.render('administracion/facturasprefacturas/programarPrefactura', {sucursal, empresa, centroCostos, cliente, inversion, cotizacion, folios, remision, moneda, tipoVenta, pPrefacturas})
    } catch (error) {
        console.log(error)
    }
}
 //! End render


 //? Render prefacturar view
 
export const renderPrefacturas = async (req, res) => {
    try {
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
        return res.render('administracion/facturasprefacturas/prefacturar', {sucursal, empresa, centroCostos, cliente, inversion, cotizacion, folios, remision, moneda, tipoVenta})
    } catch (error){

    }
}

//! End render prefacturar view

//? Render prefacturas view

export const renderVerPrefacturas = async (req, res) => {
    try{
        const pPrefacturas = await vPrefactura()
        const pPrefacturasProgramadas = await vPrefacturaProgramada()
        return res.render('administracion/facturasprefacturas/verPrefacturas',{pPrefacturas, pPrefacturasProgramadas})
    } catch (error) {
        console.log(error)
    }
}

//! En render prefacturas view

//? Render Update prefactura view

const getPprefactura = async (id) => {
    const prefactura = await pool.query('SELECT * FROM facturas_programadas WHERE factura_id = ?',[id])
    return prefactura[0][0]
}

const getProyecto = async (id) => {
    const proyecto = await pool.query('SELECT * FROM cotizaciones WHERE cotizacion_id = ?',[id])
    return proyecto[0][0]
}

export const renderVerPprefactura = async (req, res) => {
    try{
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
        return res.render('administracion/facturasprefacturas/editar',{prefactura, descripcion, proyecto, sucursal, empresa, centroCostos, cliente, inversion, cotizacion, folios, remision, moneda, tipoVenta})
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
    res.render('administracion/proveedores/buscar')
}


export const renderDCNuevo = async (req, res) => {
    res.render('administracion/disciplina/nueva')
}

export const renderDCBuscar = async (req, res) => {
    //! Buenas practicas
    try {
        let disciplinaArray = []
        const dic = await pool.query('SELECT familia_clave, familia_descripcion FROM familias')
        for (const d of dic[0]) {
            const cstatus = (d.status == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            disciplinaArray.push([d.familia_clave, d.familia_descripcion, cstatus])
        }
        
        console.log(disciplinaArray)
        return res.render('administracion/disciplina/buscar', {disciplinaArray})
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
    res.render('administracion/dispositivos/nuevo')
}


export const renderDbuscar = async (req, res) => {
    const dispositivo = await getDispositivo()
    res.render('administracion/dispositivos/buscar', getDisciplina)
}
//! End render dispositivos



