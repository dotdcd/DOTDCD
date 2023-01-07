import {pool} from '../../db.js'

export const addProyecto = async (req, res) => {
    try {
      await pool.query('INSERT INTO cotizaciones SET ?', [req.body])
      req.flash('success', { title: 'Proyecto / Cotización agregado', message: 'El Proyecto / Cotización se ha agregado correctamente' })
      return res.redirect('/dashboard/operacion/proyectos/buscar')
    } catch (error) {
      console.error(error)
      req.flash('error', { title: 'Ooops!', message: 'El Proyecto / Cotización ya existe' })
      return res.redirect('/dashboard/operacion/proyectos/buscar')
    }
  }

export const updProyecto = async (req, res) => {
    try {
        await pool.query('UPDATE cotizaciones set ? WHERE cotizacion_id = '+req.params.id, [req.body])

        req.flash('success', {title: 'Proyecto / Cotizacion actualizado', message: 'El Proyecto / Cotizacion se ha actualizado correctamente'})
        return res.redirect('/dashboard/operacion/proyectos/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'El Proyecto / Cotizacion ya existe'})
        return res.redirect('/dashboard/operacion/proyectos/buscar')
    }
}
/*
export const updProyecto = async (req, res) => {
  try {
    await pool.query(`UPDATE cotizaciones SET ? WHERE cotizacion_id = ${req.params.id}`, [req.body]);

    req.flash('success', {title: 'Proyecto / Cotización actualizado', message: 'El Proyecto / Cotización se ha actualizado correctamente'});
    return res.redirect('/dashboard/operacion/proyectos/buscar');
  } catch (error) {
    console.log(error);
    req.flash('error', {title: 'Ooops!', message: 'El Proyecto / Cotización ya existe'});
    return res.redirect('/dashboard/operacion/proyectos/buscar');
  }
}
*/
export const delProyecto = async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
      await pool.query('UPDATE cotizaciones SET cotizacion_estatus_baja = 1 WHERE cotizacion_id = '+id)
      req.flash('success', {title: 'Proyecto / Cotizacion actualizado', message: 'El Proyecto / Cotizacion se ha actualizado correctamente'})
      return res.redirect('/dashboard/operacion/proyectos/buscar')
    } catch (error) {
      console.log(error)
      req.flash('error', {title: 'Ooops!', message: 'Error al eliminar el Proyecto / Cotizacion'})
      return res.redirect('/dashboard/operacion/proyectos/buscar')
    }
  }

 


