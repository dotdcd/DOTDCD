import { pool } from '../../db.js'

export const addCliente = async (req, res) => {
    try {
        const hoy = new Date()
        const cliente_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
        const { cliente_razon_social, cliente_rfc, cliente_calle, cliente_numero, cliente_codigo_postal, cliente_colonia, cliente_municipio, cliente_estado, cliente_telefono, cliente_email, cliente_contacto, cliente_cobranza } = req.body

        await pool.query('INSERT INTO clientes set ?', [req.body])
        req.flash('success', { title: 'Cliente agregado', message: 'El cliente se ha agregado correctamente' })
        return res.redirect('/dashboard/administracion/clientes/nuevo')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El cliente ' + cliente_razon_social + ' ya existe' })
        return res.redirect('/dashboard/administracion/clientes/nuevo')
    }
}