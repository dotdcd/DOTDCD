import {pool} from '../../db.js'
import {SW_SAPIENS_URL, SW_TOKEN} from '../../config.js'
import axios from 'axios'

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
        await pool.query('INSERT INTO facturas SET ?', [data])
    } catch (error) {
        console.log(error)
    }
}

export const addFactura = async (req, res) => {
    try {
        const test = true
        console.log(req.session.userId)

        const client = await getClientInfo(req.body.cliente_id)

        const employee = req.session.userId
        const data = {
          Version: "4.0",
          FormaPago: req.body.forma_pago,
          Serie: "SW",
          Folio: req.body.folio,
          Fecha: req.body.factura_fecha_alta,
          MetodoPago: req.body.mpago,
          Sello: "",
          NoCertificado: "",
          Certificado: "",
          CondicionesDePago: "CondicionesDePago",
          SubTotal: req.body.factura_total,
          Descuento: req.body.descuento,
          Moneda: (req.body.factura_moneda_id == 1) ? "MXN" : "USD",
          TipoCambio: req.body.tipo_cambio,
          Total: req.body.factura_total,
          TipoDeComprobante: "I",
          Exportacion: "01",
          LugarExpedicion: "45610",
          Emisor: {
            Rfc: (test == true) ? "EKU9003173C9" : client.cliente_rfc,
            Nombre: (test == true) ? "ESCUELA KEMPER URGATE" : client.cliente_nombre,
            RegimenFiscal: "601"
          },
          Receptor: {
            Rfc: "EKU9003173C9",
            Nombre: "ESCUELA KEMPER URGATE",
            DomicilioFiscalReceptor: "26015",
            RegimenFiscalReceptor: "601",
            UsoCFDI: (req.body.uso_cfdi == 4) ? "CP01" : "G01"
          },
          Conceptos: [
            {
              ClaveProdServ: req.body.clave,
              NoIdentificacion: "None",
              Cantidad: req.body.cantidad,
              ClaveUnidad: req.body.cUnidad,
              Unidad: req.body.unidad,
              Descripcion: req.body.factura_descripcion,
              ValorUnitario: req.body.vUnitario,
              Importe: req.body.importe,
              Descuento: req.body.descuento,
              ObjetoImp: "04",
          }
        ],
      }

        await axios.post(`${SW_SAPIENS_URL}/v3/cfdi33/issue/json/v4`, data, {
            headers: {
                'Content-Type': 'application/jsontoxml;',
                'Authorization': `Bearer T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbXB3YVZxTHdOdHAwVXY2NTdJb1hkREtXTzE3dk9pMmdMdkFDR2xFWFVPUXpTUm9mTG1ySXdZbFNja3FRa0RlYURqbzdzdlI2UUx1WGJiKzViUWY2dnZGbFloUDJ6RjhFTGF4M1BySnJ4cHF0YjUvbmRyWWpjTkVLN3ppd3RxL0dJPQ.T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbFlVcU92YUJTZWlHU3pER1kySnlXRTF4alNUS0ZWcUlVS0NhelhqaXdnWTRncklVSWVvZlFZMWNyUjVxYUFxMWFxcStUL1IzdGpHRTJqdS9Zakw2UGRPd0VpaU92M2JEeVI4ZktFRThLQlg0blV6VktZL1M3b2pIc3JhYlRVbi8rUG9iaXUzK3VMWHU2cEYvcHlJUHNzZXprL0dTNzlqN0VacCtmd0dtelVMRjd4dmFiRnoxRGJRcmJNV3cyVnZtVklXaGlGM1JIOHNmLzE4eGhCRzdlbzFUMzJnVmJyUlFQYzJwYUtnQmdhZDNhNGZ6bVJRV1VqYVVwd1ZoNlZLRnZJN0d0MDhoU21oVy8rVnNxTnBqOGpuQklUYTIrMEdqRHJEV3BxRENhQWlTRFB2ZXhRVHJxQktFWW1JZW9tVlBQU0g2cDEvZ0tKVXRDNHBxRXFRS3RVTDhiTzdRcUM4c1F5bG1Xb0taNDVtTUlwTWtRQVJJdW8wbGRDUHFhWUtTMlB5Z3NPQVpCQ0Y3eDhFLytMN3ZUVzBzYWowdG5PNVU0NTQxaElYa2d0R3NPME9abkFVekRIcDloTm9wNFVTN2M4VjZtczBhMHBUZHJZU1ZFQUlaOVI.tSQqJnADDxRCmAW0X_qlhhlWDaeC4yYpxiG0RlEXBQg`
            }
        })
        .then(async (response) => {
            if (response.status == 200) {
                const data = {
                  factura_empresa_id: req.body.factura_empresa_id,
                  factura_cliente_id: req.body.factura_cliente_id,
                  factura_descripcion: req.body.factura_descripcion,
                  factura_empleado_id: employee,
                  factura_centrodecostos_id: req.body.factura_centrodecostos_id,
                  factura_proyecto_id: req.body.factura_proyecto_id,
                  factura_folio_id: req.body.factura_folio_id,
                  factura_remisionfactura_id: req.body.factura_remisionfactura_id,
                  factura_moneda_id: req.body.factura_moneda_id,
                  factura_subtotal: req.body.factura_subtotal,
                  factura_iva: req.body.factura_iva,
                  factura_total: req.body.factura_total,
                  factura_fecha_alta: req.body.factura_fecha_alta,
                  factura_observaciones: req.body.factura_observaciones,
                  retencion: req.body.retencion,
                  retencion_isr: req.body.retencion_isr,
                  tipo_venta: req.body.tipo_venta,
                  tipo_cambio: req.body.tipo_cambio,
                  factura_anticipo_id: req.body.factura_anticipo_id,
                  factura_inversion_id: req.body.factura_inversion_id,
                  correo: req.body.correo,
                  uso_cfdi: req.body.uso_cfdi,
                  uuid: response.data.data.uuid,
                  cadena_sat: response.data.data.cadenaOriginalSAT,
                  sello_sat: response.data.data.selloSAT,
                  sello_cfdi: response.data.data.selloCFDI,
                  qr: response.data.data.qrCode,
                }
                await uploaToDB(data)
                req.flash('success', {message: 'Factura timbrada correctamente', title: 'Factura Timbrada'})
                return res.redirect('/dashboard/administracion/facturas')
            } else {
                req.flash('error', {message: 'Error al timbrar la factura', title: 'Error'})
                return res.redirect('/dashboard/administracion/facturas/nuevo')
            }
        })
        .catch((error) => {
            console.log(error)
            req.flash('error', {message: 'Error al timbrar la factura', title: 'Error'})
            return res.redirect('/dashboard/administracion/facturas/nuevo')
        })
    } catch (error) {
        console.log(error)
        req.flash('error', {message: 'Error al timbrar la factura', title: 'Error'})
        return res.redirect('/dashboard/administracion/facturas/nuevo')
    }
}