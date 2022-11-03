import { pool } from '../../db.js'

export const renderCoNuevo = async(req, res) => {
    res.render('contabilidad/inversiones/nuevo')
}

export const renderCoRequerir = async(req, res) => {
    res.render('contabilidad/inversiones/requerir')
}

export const renderCoBuscar = async(req, res) => {


    let invArray = []
    const inv = await  pool.query("SELECT inversion_clave as clave, Inversion_descripcion as descripcion, inversion_estatus_baja as estatus FROM `inversiones`")
    inv[0].forEach(i => {
        const istatus = (i.estatus == 0) ? 'Inactivo' : 'Activo'
        invArray.push([i.clave, i.descripcion, istatus])
    });

    res.render('contabilidad/inversiones/buscar', {invArray})
}