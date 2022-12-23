import {pool} from '../../db.js'

export const addRequisicion = async (req, res) => {
    try {
        await pool.query('INSERT INTO requisiciones set ?', [req.body])

        req.flash('success', {title: 'Requisición agregada', message: 'La requisición se ha agregado correctamente'})
        return res.redirect('/dashboard/administracion/requisiciones/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'La requisición ya existe'})
        return res.redirect('/dashboard/administracion/requisiciones/buscar')
    }
}

export const updRequisicion = async (req, res) => {
    try {
        await pool.query('UPDATE requisiciones set ? WHERE requisicion_id = ?', [req.body, req.params.id])
        console.log(req.body)
        return res.redirect('/dashboard/administracion/requisiciones/buscar')
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'La requisición no existe', status: 500})
    }
}

export const delRequisicion = async (req, res) => {
    try {
        await pool.query('DELETE FROM requisiciones WHERE requisicion_id = ?', [req.params.id])
        return res.status(200).json({message: 'Requisición eliminada correctamente',status: 200})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'No se puede eliminar la requisición', status: 500})
    }
}