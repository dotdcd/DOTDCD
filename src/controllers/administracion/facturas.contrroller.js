import {pool} from '../db.js'
import {SW_SAPIENS_URL, SW_TOKEN} from '../config.js'
import axios from 'axios'

const getClientInfo = async (id) => {
    try {
        const client = await pool.query('SELECT * FROM clientes WHERE cliente_id = ?', [id])
        return client[0][0]
    } catch (error) {
        console.log(error)
    }
}

export const addPrefactura = async (req, res) => {
    try {
        const test = true

        const client = await getClientInfo(req.body.cliente_id)

        await axios.post(`${SW_SAPIENS_URL}/v3/cfdi33/issue/json/v4`, {
            headers: {
                'Content-Type': 'application/jsontoxml;',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${SW_TOKEN}`
            },
            data: {
                Version: "4.0",
                FormaPago: "01",
                Serie: "SW",
                Folio: "123456",
                Fecha: "2022-09-12T00:00:00",
                MetodoPago: "PUE",
                Sello: "",
                NoCertificado: "",
                Certificado: "",
                CondicionesDePago: "CondicionesDePago",
                SubTotal: req.body.factura_subtotal,
                Descuento: "0.00",
                Moneda: (req.body.factura_moneda_id == 1) ? "MXN" : "USD",
                TipoCambio: req.body.tipo_cambio,
                Total: req.body.factura_total,
                TipoDeComprobante: "I",
                Exportacion: "01",
                LugarExpedicion: "45610",
                Emisor: {
                  Rfc: (test == true) ? "H&E951128469" : client.cliente_rfc,
                  Nombre: (test == true) ? "HERRERIA & ELECTRICOS" : client.cliente_nombre,
                  RegimenFiscal: "601"
                },
                Receptor: {
                  Rfc: "EKU9003173C9",
                  Nombre: "ESCUELA KEMPER URGATE",
                  DomicilioFiscalReceptor: "26015",
                  RegimenFiscalReceptor: "601",
                  UsoCFDI: (client[0].uso_cfdi == 4) ? "CPO1" : "G01"
                },
                Conceptos: [
                  {
                    ClaveProdServ: "50211503",
                    NoIdentificacion: "None",
                    Cantidad: "1.0",
                    ClaveUnidad: "H87",
                    Unidad: "Pieza",
                    Descripcion: "Cigarros",
                    ValorUnitario: "10.00",
                    Importe: "10.00",
                    Descuento: "0.00",
                    ObjetoImp: "02",
                    Impuestos: {
                      Traslados: [
                        {
                          Base: "1",
                          Importe: "1",
                          Impuesto: "002",
                          TasaOCuota: "0.160000",
                          TipoFactor: "Tasa"
                        }
                      ],
                      Retenciones: [
                        {
                          Base: "1",
                          Importe: "1",
                          Impuesto: "002",
                          TasaOCuota: "0.040000",
                          TipoFactor: "Tasa"
                        }
                      ]
                    }
                  }
                ],
                Impuestos: {
                  TotalImpuestosTrasladados: "1.00",
                  TotalImpuestosRetenidos: "1.00",
                  Retenciones: [
                    {
                      Importe: "1.00",
                      Impuesto: "002"
                    }
                  ],
                  Traslados: [
                    {
                      Base: "1.00",
                      Importe: "1.00",
                      Impuesto: "002",
                      TasaOCuota: "0.160000",
                      TipoFactor: "Tasa"
                    }
                  ]
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}