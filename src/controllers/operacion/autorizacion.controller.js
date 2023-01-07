import {pool} from '../../db.js'

export const delAutorizacion = async (req, res) => {
    const {id} = req.params;
    try {
        await pool.query('UPDATE cotizaciones set cotizacion_estatus_baja = 1 WHERE cotizacion_id = '+req.params.id, [req.body])

        req.flash('success', {title: 'Proyecto / Cotizacion actualizado', message: 'El Proyecto / Cotizacion se ha dado de baja correctamente'})
        return res.redirect('/dashboard/operacion/proyectos/autorizar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'Error el Proyecto / Cotizacion'})
        return res.redirect('/dashboard/operacion/proyectos/autorizar')
    }
}

export const updAutorizacion = async (req, res) => {
    try {
        await pool.query('UPDATE cotizaciones set ? WHERE cotizacion_id = '+req.params.id, [req.body])

        req.flash('success', {title: 'Proyecto / Cotizacion actualizado', message: 'El Proyecto / Cotizacion se ha actualizado correctamente'})
        return res.redirect('/dashboard/operacion/proyectos/autorizar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'El Proyecto / Cotizacion ya existe'})
        return res.redirect('/dashboard/operacion/proyectos/autorizar')
    }

}
