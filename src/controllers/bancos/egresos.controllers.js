import {pool} from '../../db.js'

export const addEgreso = async (req, res) => {
    try { 
        console.log(req.body)
        await pool.query('INSERT INTO egresos set ?', [req.body])
        req.flash('success', {title: 'Egreso agregado', message: 'El egreso se ha agregado correctamente'})
        return res.redirect('/dashboard/bancos/egresos/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'El egreso no se ha podido agregar'})
        return res.redirect('/dashboard/bancos/egresos/buscar')
    }   
}

export const delEgreso = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM egresos WHERE egreso_id = ?', [id])
        return res.status(200).json({message: 'Egreso eliminado', status: 200})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Ooops! El egreso no se ha podido eliminar', status: 500})
    }
}