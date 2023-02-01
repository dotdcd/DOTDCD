import {pool} from '../../db.js'
import {SW_SAPIENS_URL, SW_TOKEN} from '../../config.js'
import axios from 'axios'

//? delete ingreso
export const delEgreso = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM cheques WHERE egreso_id = ?', [id])
        return res.status(200).json({message: 'Egreso eliminado', status: 200})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Ooops! El egreso no se ha podido eliminar', status: 500})
    }
}

//? timbrado
const getClientInfo = async (id) => {
    try {
        const client = await pool.query('SELECT * FROM clientes WHERE cliente_id = ?', [id])
        return client[0][0]
    } catch (error) {
        console.log(error)
    }
}

const getEmpresaInfo = async (id) => {
    try {
        const empresa = await pool.query('SELECT * FROM multiempresa WHERE empresa_id = ?', [id])
        console.log(empresa[0][0])
        return empresa[0][0]
    } catch (error) {
        console.log(error)
    }
}

const getFacturaInfo = async (id) => {
    try {
        const factura = await pool.query('SELECT * FROM facturas WHERE factura_id = ?', [id])
        return factura[0][0]
    } catch (error) {
        console.log(error)
    }
}

const uploaToDB = async (data) => {
    try {
        await pool.query('INSERT INTO cheques SET ?', [data])
    } catch (error) {
        console.log(error)
    }
}

export const addIngreso = async (req, res) => {
    try {

        const empresa = await getEmpresaInfo(req.body.cheque_empresa_id)
        const client = await getClientInfo(req.body.cheque_cliente_id)
        const factura = await getFacturaInfo(req.body.cheque_factura_id)

        const data = {
            Version: "4.0",
            Serie: "Serie",
            Folio: req.body.i_folio,
            Fecha: req.body.FechaTransferencia,
            Sello: "",
            NoCertificado: "",
            Certificado: "",
            Moneda: (factura.factura_moneda_id == 1) ? "MXN" : "USD",
            TipoDeComprobante: "P",
            Exportacion: "01",
            LugarExpedicion: empresa.emprea_cp,
            Emisor: {
                Rfc: empresa.empresa_rfc,
                Nombre: empresa.empresa_razon_social,
                RegimenFiscal: empresa.empresa_regimen_fiscal
            },
            Receptor: {
                Rfc: client.cliente_rfc,
                Nombre: client.cliente_razon_social,
                DomicilioFiscalReceptor: client.cliente_codigo_postal,
                RegimenFiscalReceptor: client.cliente_regimen_fiscal,
                UsoCFDI: req.body.uso_cfdi
            },
            Conceptos: [
                {
                    ClaveProdServ: factura.factura_clave_prod,
                    Cantidad: 1,
                    ClaveUnidad: factura.factura_c_unidad,
                    Descripcion: factura.factura_descripcion,
                    ObjetoImp: "01"
                }
            ],
            Complemento: {
                Any: [
                    {
                        "Pago20:Pagos": {
                            Version: "2.0",
                            Totales: {
                                MontoTotalPagos: req.body.cheque_monto,
                                TotalTrasladosBaseIVA16: req.body.cheque_monto,
                                TotalTrasladosImpuestoIVA16: req.body.cheque_iva
                            },
                            Pago: [
                                {
                                    FechaPago: req.body.FechaTransferencia,
                                    FormaDePagoP: req.body.forma_pago,
                                    MonedaP: (factura.factura_moneda_id == 1) ? "MXN" : "USD",
                                    Monto: req.body.cheque_monto,
                                    TipoCambioP: "1",
                                    DoctoRelacionado: [
                                        {
                                            IdDocumento: factura.uuid,
                                            MonedaDR: (factura.factura_moneda_id == 1) ? "MXN" : "USD",
                                            NumParcialidad: "1",
                                            ImpSaldoAnt: factura.factura_total,
                                            ImpPagado: req.body.cheque_monto,
                                            ImpSaldoInsoluto: factura.factura_total - req.body.cheque_monto,
                                            ObjetoImpDR: "02",
                                            EquivalenciaDR: "1",
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        }

        await axios.post(`${SW_SAPIENS_URL}/v3/cfdi33/issue/json/v4`, data, {
            headers: {
                'Content-Type': 'application/jsontoxml;',
                'Authorization': 'Bearer ' + SW_TOKEN
            }
        })
        .then(async (response) => {
            if(response == 200) {
                const data = {
                    cheque_id: 123456,
                    cheque_empresa_id: req.body.cheque_empresa_id,
                    cheque_cuenta_id: req.body.cheque_cuenta_id,
                    TipoCambio: req.body.TipoCambio,
                    cheque_cliente_id: req.body.cheque_cliente_id,
                    cheque_monto: req.body.cheque_monto,
                    cuenta_contable: req.body.cuenta_contable,
                    cheque_subtotal: req.body.cheque_subtotal,
                    cuenta_contable2: req.body.cuenta_contable2,
                    cheque_iva: req.body.cheque_iva,
                    cuenta_contable3: req.body.cuenta_contable3,
                    cheque_factura_id: req.body.cheque_factura_id,
                    tipo_venta: req.body.tipo_venta,
                    NumFactura: req.body.NumFactura,
                    FechaTransferencia: req.body.FechaTransferencia,
                    cheque_comentario: req.body.cheque_comentario,
                    cheque_ingreso: 1
                }
                console.log(response)
                await uploaToDB(data)
                req.flash('success', {message: 'Ingreso Timbrado correctamente', title: 'Ingreso Timbrado'})
                return res.redirect('/dashboard/contabilidad/ingresos/buscar')
            } else {
                console.log(response)
                req.flash('error', {message: 'Ooops! El ingreso no se ha podido timbrar', title: 'Error al timbrar'})
                return res.redirect('/dashboard/contabilidad/ingresos/buscar')
            }
        })
        .catch((error) => {
            console.log(error)
            req.flash('error', {message: 'Ooops! El ingreso no se ha podido timbrar', title: 'Error al timbrar'})
            return res.redirect('/dashboard/contabilidad/ingresos/buscar')
        })
    } catch (error) {
        console.log(error)
        req.flash('error', {message: 'Ooops! El ingreso no se ha podido timbrar', title: 'Error al timbrar'})
        return res.redirect('/dashboard/contabilidad/ingresos/buscar')
    }
}