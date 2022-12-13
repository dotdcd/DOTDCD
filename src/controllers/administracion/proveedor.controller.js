import { pool } from '../../db.js'

export const addProveedor = async (req, res) => {
    const { proveedor_razon_social, proveedor_contacto, proveedor_contacto_email, proveedor_telefono, proveedor_direccion, proveedor_rfc, proveedor_web, proveedor_usuario_password, proveedor_dias_credito, proveedor_limite_credito, proveedor_tipo_id } = req.body
    const hoy = new Date()
    const proveedor_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
    try {
        await pool.query('INSERT INTO proveedores set ?', [req.body])
        req.flash('success', { title: 'Proveedor agregado', message: 'La marca se ha agregado correctamente' })
        return res.redirect('/dashboard/administracion/proveedores/nuevo')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'El proveedor ' + proveedor_razon_social + ' ya existe' })
        return res.redirect('/dashboard/administracion/proveedores/nuevo')
    }
}