import {pool} from '../../db.js'




export const addFolio = async (req, res) => {
    try {
        await pool.query('INSERT INTO folios set ?', [req.body])
        req.flash('success', { title: 'Folio agregado', message: 'El folio se ha agregado correctamente' })
        return res.redirect('/dashboard/operacion/folios/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El folio ' + folio + ' ya existe' })
        return res.redirect('/dashboard/operacion/folios/nuevo')
    }
}

export const updFolio = async (req, res) => {
    try {
        await pool.query('UPDATE folios set ? WHERE folio_id = ?', [req.body, req.params.id])
        req.flash('success', { title: 'Folio actualizado', message: 'El folio se ha actualizado correctamente' })
        return res.redirect('/dashboard/operacion/folios/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El folio ' + folio + ' ya existe' })
        return res.redirect('/dashboard/operacion/folios/editar/' + req.params.id)
    }
}

export const delFolio = async (req, res) => {
    try {
        const id = req.params.id
        await pool.query('UPDATE folios SET folio_estatus_baja = 1 WHERE folio_id ='+ id)
        req.flash('success', { title: 'Folio dado de baja', message: 'El folio se ha dado de baja correctamente' })
        return res.redirect('/dashboard/operacion/folios/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El folio ' + folio + ' ya existe' })
        return res.redirect('/dashboard/operacion/folios/buscar')
    }
}