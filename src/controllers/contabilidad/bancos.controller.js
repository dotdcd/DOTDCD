import { pool } from '../../db.js'



export const addBanco = async (req, res) => {
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
    try {
        await pool.query('DELETE FROM bancos_cuentas WHERE banco_cuenta_id = ?', [req.params.id])
        return res.status(200).json({ message: 'La cuenta se ha eliminado correctamente', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'La cuenta no se puede eliminar', status: 500 })
    }
}

