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

const uploaToDB = async (data) => {
    try {
        await pool.query('INSERT INTO cheques SET ?', [data])
    } catch (error) {
        console.log(error)
    }
}

export const addIngreso = async (req, res) => {
    try {
        const cliente = await getClientInfo(req.body.cheque_cliente_id)
        const data = {
            Version: "4.0",
            Serie: "Serie",
            Folio: "Folio123",
            Fecha: "2022-07-21T00:18:10",
            Sello: "",
            NoCertificado: "",
            Certificado: "",
            Moneda: "XXX",
            TipoDeComprobante: "P",
            Exportacion: "01",
            LugarExpedicion: "20000",
            Emisor: {
                Rfc: "EKU9003173C9",
                Nombre: "ESCUELA KEMPER URGATE",
                RegimenFiscal: 601
            },
            Receptor: {
                Rfc: "URE180429TM6",
                Nombre: "UNIVERSIDAD ROBOTICA ESPAÑOLA",
                DomicilioFiscalReceptor: "65000",
                RegimenFiscalReceptor: 601,
                UsoCFDI: "CP01"
            },
            Conceptos: [
                {
                    ClaveProdServ: "84111506",
                    Cantidad: 1,
                    ClaveUnidad: "ACT",
                    Descripcion: "Pago",
                    ObjetoImp: "01"
                }
            ],
            "Complemento": {
                "Any": [
                    {
                        "Pago20:Pagos": {
                            "Version": "2.0",
                            "Totales": {
                                "MontoTotalPagos": "100.00",
                                "TotalTrasladosBaseIVA16": "100.00",
                                "TotalTrasladosImpuestoIVA16": "16.00"
                            },
                            "Pago": [
                                {
                                    "FechaPago": "2021-12-15T00:00:00",
                                    "FormaDePagoP": "01",
                                    "MonedaP": "MXN",
                                    "Monto": "100.00",
                                    "TipoCambioP": "1",
                                    "DoctoRelacionado": [
                                        {
                                            "IdDocumento": "bfc36522-4b8e-45c4-8f14-d11b289f9eb7",
                                            "MonedaDR": "MXN",
                                            "NumParcialidad": "1",
                                            "ImpSaldoAnt": "200.00",
                                            "ImpPagado": "100.00",
                                            "ImpSaldoInsoluto": "100.00",
                                            "ObjetoImpDR": "02",
                                            "EquivalenciaDR": "1",
                                            "ImpuestosDR": {
                                                "TrasladosDR": [
                                                    {
                                                        "BaseDR": "100.00",
                                                        "ImpuestoDR": "002",
                                                        "TipoFactorDR": "Tasa",
                                                        "TasaOCuotaDR": "0.160000",
                                                        "ImporteDR": "16.00"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    "ImpuestosP": {
                                        "TrasladosP": [
                                            {
                                                "BaseP": "100.00",
                                                "ImpuestoP": "002",
                                                "TipoFactorP": "Tasa",
                                                "TasaOCuotaP": "0.160000",
                                                "ImporteP": "16.00"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    } catch (error) {
        console.log(error)   
    }
}