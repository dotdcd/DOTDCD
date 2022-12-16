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


export const updateEmpresa = async (req, res) => {
    try {
        await pool.query('UPDATE multiempresa set ? WHERE id = ?', [req.body, req.params.id])
        req.flash('success', { title: 'Empresa actualizada', message: 'La empresa se ha actualizado correctamente' })
        return res.redirect('/dashboard/contabilidad/multiempresas')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'La empresa no se ha podido actualizar' })
        return res.redirect('/dashboard/contabilidad/multiempresas')
    }
}
//! no redireccionar a la misma pagina
export const deleteEmpresa = async (req, res) => {
    try {
        await pool.query('DELETE FROM multiempresa WHERE id = ?', [req.params.id])
        req.flash('success', { title: 'Empresa eliminada', message: 'La empresa se ha eliminado correctamente' })
        return res.redirect('/dashboard/contabilidad/multiempresas')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'La empresa no se ha podido eliminar' })
        return res.redirect('/dashboard/contabilidad/multiempresas')
    }   
}