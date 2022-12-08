import {getEmpresa, getSucursal, getCentrodeCosto} from '../erp/contabilidad.controller.js'
import {pool} from '../../db.js'
import { polygonLength } from 'd3'

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
    return cotizacion[0]
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


export const renderPrefacturar = async (req, res) => {
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
    } catch (error) {
        console.log(error)
    }
}
 //! End render

//? Add prefactura

export const addPrefactura = async (req, res) => {
    try {
        await pool.query("INSERT INTO facturas_programadas SET ? ", [req.body])
        req.flash('success', { title: 'Prefactura Programada!', message: 'La prefactura se ha programado correctamente.' })
        res.redirect('/dashboard/administracion/facturas/prefacturar')
    } catch (error) {
        console.log(error)
    }
}

export const updPrefactura = async (req, res) => {
    try {
        await pool.query("UPDATE facturas_programadas SET ? WHERE prefactura_id = ?", [req.body, req.params.id])
        req.flash('success', { title: 'Prefactura Actualizada!', message: 'La prefactura se ha actualizado correctamente.' })
        res.redirect('/dashboard/administracion/facturas/prefacturar')
    } catch (error) {
        console.log(error)
    }
}


//? Render prefacturas programadas
export const renderMultiremision = async (req, res) => {
    try {
        return res.render('administracion/facturasprefacturas/prefacturasprogramadas')
    } catch (error) {
        console.log(error)
    }
}