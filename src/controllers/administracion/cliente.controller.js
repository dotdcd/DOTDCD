import { pool } from '../../db.js'


//* Agregar cliente
export const addCliente = async (req, res) => {
    try {
        await pool.query('INSERT INTO clientes set ?', [req.body])
        req.flash('success', { title: 'Cliente agregado', message: 'El cliente se ha agregado correctamente' })
        return res.redirect('/dashboard/administracion/clientes/nuevo')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El cliente ' + cliente_razon_social + ' ya existe' })
        return res.redirect('/dashboard/administracion/clientes/nuevo')
    }
}
//! Fin Agregar cliente

//* Actualizar cliente
export const updCliente = async (req, res) => {
    const cliente_id = req.params.id
    const {  cliente_razon_social, cliente_rfc, cliente_calle, cliente_numero, cliente_codigo_postal, cliente_colonia, cliente_municipio, cliente_estado, cliente_telefono, cliente_email, cliente_contacto, cliente_cobranza, cliente_estatus_baja  } = req.params
    try {
        await pool.query('UPDATE clientes SET ? WHERE cliente_id = '+ cliente_id, [req.body])
        return res.redirect('/dashboard/administracion/clientes/buscar')
    } catch (error) {
        console.log(error)
        return res.redirect('/dashboard/administracion/clientes/buscar')
    }
}
//! Fin Actualizar cliente


//* Eliminar cliente
export const delCliente = async (req, res) => {
    const { cliente_id } = req.params
    try {
        await pool.query('DELETE FROM clientes WHERE cliente_id = ?', [req.params.id])
        return res.status(200).json({ message: 'El cliente se ha eliminado correctamente', status: 200 })
    } catch (error) {
        return res.satus(500).json({ message: 'El cliente no se puede eliminar', status: 500 })
    }
}
//! Fin Eliminar cliente







