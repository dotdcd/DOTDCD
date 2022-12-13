import { pool } from '../../db.js'


export const addEmpresa = async (req, res) => {

    const {empresa_razon_social, empresa_direccion, empresa_colonia, empresa_ciudad_estado, empresa_rfc, empresa_telefono, 	empresa_registro_patronal } = req.body

    try {
        await pool.query('INSERT INTO multiempresa set ?', [req.body])
        req.flash('success', { title: 'Empresa agregada', message: 'La empresa se ha agregado correctamente' })
        return res.redirect('/dashboard/contabilidad/multiempresas/nuevo')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'La empresa ' + empresa_razon_social + ' ya existe' })
        return res.redirect('/dashboard/contabilidad/multiempresas/nuevo')
    }
}