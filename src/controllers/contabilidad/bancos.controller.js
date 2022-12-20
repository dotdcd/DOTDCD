import { pool } from '../../db.js'



export const addBanco = async (req, res) => {
    const { banco_cuenta_id, banco_cuenta_banco, banco_cuenta_numero, banco_cuenta_clabe, banco_cuenta_comentario, banco_cuenta_contacto, banco_cuenta_saldo_inicial, banco_cuenta_limite_credito, banco_cuenta_moneda_id, banco_empresa_id, banco_cuenta_tipo_id, banco_cuenta_estatus_baja } = req.body
    try {
        await pool.query('INSERT INTO bancos_cuentas set ?', [req.body])
        req.flash('success', { title: 'Banco agregado', message: 'El banco se ha agregado correctamente' })
        return res.redirect('/dashboard/contabilidad/bancos/cuentas/buscar')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'El banco ' + req.body.banco_clave + ' ya existe' })
        return res.redirect('/dashboard/contabilidad/bancos/cuentas/buscar')
    }
}

export const updBanco = async (req, res) => {
    const { banco_cuenta_id, banco_cuenta_banco, banco_cuenta_numero, banco_cuenta_clabe, banco_cuenta_comentario, banco_cuenta_contacto, banco_cuenta_saldo_inicial, banco_cuenta_limite_credito, banco_cuenta_moneda_id, banco_empresa_id, banco_cuenta_tipo_id, banco_cuenta_estatus_baja } = req.body
    const id = req.params.id
    try {
        await pool.query('UPDATE bancos_cuentas set ? WHERE banco_cuenta_id = ' + id, [req.body])
        req.flash('success', { title: 'Banco actualizado', message: 'El banco se ha actualizado correctamente' })
        return res.redirect('/dashboard/contabilidad/bancos/cuentas/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El banco ' + req.body.banco_clave + ' ya existe' })
        return res.redirect('/dashboard/contabilidad/bancos/cuentas/buscar')
    }
}



export const deleteBanco = async (req, res) => {
    const {id} = req.params.id
    try {
        await pool.query('DELETE FROM bancos_cuentas WHERE banco_cuenta_id = ?', [req.params.id])
        return res.status(200).json({ message: 'La cuenta se ha eliminado correctamente', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'La cuenta no se puede eliminar', status: 500 })
    }
}

