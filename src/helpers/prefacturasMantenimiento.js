import { pool } from '../db.js'

export const checkPrefacturas = async (req, res) => {
    try {
        const hoy = new Date();
        const dia = hoy.getDate();
        console.log(dia)
        const response = await pool.query('SELECT * FROM facturas_programadas WHERE dia_facturacion = ?', [dia]);

        if (response.length > 0) {
            for (const i of response[0]) {
                if (i.meses_facturar > 0) {
                    await pool.query('INSERT INTO facturas SET ?', {
                        factura_id: 8507,
                        factura_empresa_id: i.factura_empresa_id,
                        factura_cliente_id: i.factura_cliente_id,
                        factura_descripcion: i.factura_descripcion,
                        factura_empleado_id: i.factura_empleado_id,
                        factura_centrodecostos_id: i.factura_centrodecostos_id,
                        factura_proyecto_id: i.factura_proyecto_id,
                        factura_folio_id: i.factura_folio_id,
                        factura_remisionfactura_id: i.factura_remisionfactura_id,
                        factura_moneda_id: i.factura_moneda_id,
                        factura_subtotal: i.factura_subtotal,
                        factura_iva: i.factura_iva,
                        factura_total: i.factura_total,
                        factura_fecha_alta: i.factura_fecha_alta,
                        factura_observaciones: i.factura_observaciones,
                        factura_estatus_baja: i.factura_estatus_baja,
                        factura_fecha_baja: i.factura_fecha_baja,
                        factura_numero: i.factura_numero,
                        factura_factura: i.factura_factura,
                        factura_pdf: i.factura_pdf,
                        factura_xml: i.factura_xml,
                        factura_inversion_id: i.factura_inversion_id,
                        correo: i.correo,
                        uso_cfdi: i.uso_cfdi,
                        forma_pago: i.forma_pago,
                        retencion: i.retencion,
                        fecha_cancelacion: i.fecha_cancelacion,
                        cadena_sat: i.cadena_sat,
                        tipo_venta: i.tipo_venta,
                        retencion_isr: i.retencion_isr,
                        tipo_cambio: i.tipo_cambio,
                        uuid: i.uuid,
                        sucursal_id: i.sucursal_id,
                        dias_credito: i.dias_credito
                    })

                    const newM = i.meses_facturar - 1;

                    if (newM > 0) {
                        await pool.query('UPDATE facturas_programadas SET meses_facturar = ? WHERE factura_id = ?', [newM, i.factura_id])
                        console.log('Factura creada y meses restantes actualizados')
                    } else {
                        await pool.query('UPDATE facturas_programadas SET meses_facturar = ? WHERE factura_id = ?', [newM, i.factura_id])
                        await pool.query('DELETE FROM facturas_programadas WHERE factura_id = ?', [i.factura_id])
                        console.log('Factura creada y prefactura eliminada')
                    }
                    console.log('Factura creada')
                }
            }
        } else {
            console.log('No hay prefacturas para hoy')
        }
        
    } catch (e) {
        console.log(e);
    }
}