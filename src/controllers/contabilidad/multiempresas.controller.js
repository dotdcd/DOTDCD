import { pool } from '../../db.js'


export const addEmpresa = async (req, res) => {

    const {empresa_razon_social} = req.body

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
    const empresa_id = req.params.id
    try {
        await pool.query('UPDATE multiempresa set ? WHERE empresa_id = '+empresa_id, [req.body])
        req.flash('success', { title: 'Empresa actualizada', message: 'La empresa se ha actualizado correctamente' })
        return res.redirect('/dashboard/contabilidad/multiempresas/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'La empresa no se ha podido actualizar' })
        return res.redirect('/dashboard/contabilidad/multiempresas/buscar')
    }
}


//! no redireccionar a la misma pagina
export const deleteEmpresa = async (req, res) => {
    try {
        await pool.query('DELETE FROM multiempresa WHERE empresa_id = ?', [req.params.id])
        return res.status(200).json({ message: 'La empresa se ha eliminado correctamente', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'El proveedor no se puede eliminar', status: 500 })
    }   
}
