import { pool } from '../../db.js'

//? Add prefactura

export const addPrefactura = async (req, res) => {
    try {
        await pool.query("INSERT INTO facturas_programadas SET ? ", [req.body])

        req.flash('success', { title: 'Prefactura Programada!', message: 'La prefactura se ha programado correctamente.' })
        res.redirect('/dashboard/administracion/facturas/prefacturar')
    } catch (error) {
        console.log(error)
    }
}

export const updPrefactura = async (req, res) => {
    try {
        await pool.query("UPDATE facturas_programadas SET ? WHERE prefactura_id = ?", [req.body, req.params.id])
        req.flash('success', { title: 'Prefactura Actualizada!', message: 'La prefactura se ha actualizado correctamente.' })
        res.redirect('/dashboard/administracion/facturas/prefacturar')
    } catch (error) {
        console.log(error)
    }
}

export const delPrefactura = async (req, res) => {
    try {
        await pool.query("DELETE FROM facturas_programadas WHERE prefactura_id = ?", [req.params.id])
        req.flash('success', { title: 'Prefactura Eliminada!', message: 'La prefactura se ha eliminado correctamente.' })
        res.redirect('/dashboard/administracion/facturas/prefacturar')
    } catch (error) {
        console.log(error)
    }
}


//? Render prefacturas programadas
export const renderMultiremision = async (req, res) => {
    try {
        return res.render('administracion/facturasprefacturas/prefacturasprogramadas')
    } catch (error) {
        console.log(error)
    }
}
