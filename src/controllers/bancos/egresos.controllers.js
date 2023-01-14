import {pool} from '../../db.js'
import fs from 'fs-extra'
import path from 'path'
import { __dirname } from '../../server.js'

export const addEgreso = async (req, res) => {
    try { 
        console.log(req.body)
        await pool.query('INSERT INTO cheques set ?', [req.body])
        req.flash('success', {title: 'Egreso agregado', message: 'El egreso se ha agregado correctamente'})
        return res.redirect('/dashboard/contabilidad/egresos/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'El egreso no se ha podido agregar'})
        return res.redirect('/dashboard/contabilidad/egresos/buscar')
    }   
}

export const delEgreso = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM cheques WHERE egreso_id = ?', [id])
        return res.status(200).json({message: 'Egreso eliminado', status: 200})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Ooops! El egreso no se ha podido eliminar', status: 500})
    }
}

//? Generar txt

const getEgreso = async (id) => {
    try {
        const egreso = await pool.query("SELECT c.cheque_id, c.cheque_folio, c.UUID, c.cheque_monto, p.proveedor_razon_social, DATE_FORMAT(c.cheque_fecha_alta, '%Y%m%d') as fecha, c.cheque_subtotal, c.cuenta_contable2, c.cuenta_contable3, c.cuenta_contable, c.cheque_iva  FROM cheques c INNER JOIN proveedores p ON p.proveedor_id = c.cheque_proveedor_id WHERE c.cheque_id = ?", [id])
        return egreso[0][0]
    } catch (error) {
        console.log(error)
    }
}

const genEgreso = async (id) => {
    try {
        const info = await getEgreso(id)
        //console.log(info)
        //const fecha = info.cheque_fecha_alta.split('-')
        //const newfecha = `${fecha[0]}${fecha[1]}${fecha[2]}`
        const egreso = {
            uuid: info.UUID,
            folio: info.cheque_folio,
            fecha: info.fecha,
            cargo1: info.cheque_subtotal,
            cargo2: info.cheque_iva,
            abono: info.cheque_monto,
            concepto: info.proveedor_razon_social,
            nPoliza: info.cheque_id,
            cuenta1: info.cuenta_contable2,
            cuenta2: info.cuenta_contable3,
            cuenta3: info.cuenta_contable
        }
        const file =  `P  ${egreso.fecha}    2      ${egreso.nPoliza} 1 0          ${egreso.concepto}                                                                      12 1 0  \nM1 ${egreso.cuenta1}                       ${egreso.folio}                   0  ${egreso.cargo1}            0          0.0                  ${egreso.concepto}                                                                            		\nAM ${egreso.uuid}	\nM1 ${egreso.cuenta2}                       ${egreso.folio}                   0  ${egreso.cargo2}             0          0.0                  ${egreso.concepto}                                                                            		\nAM ${egreso.uuid}	\nM1 ${egreso.cuenta3}                       ${egreso.folio}                   1  ${egreso.abono}            0          0.0                  ${egreso.concepto}                                                                            		\nAM ${egreso.uuid}	\nAD ${egreso.uuid}	`
        return file
    } catch (error) {
        console.log(error)
        return false
    }
}

export const genTxt = async (req, res) => {
    try {
        const egreso = await genEgreso(req.params.id)
        res.setHeader('Content-disposition', 'attachment; filename=contpaq.txt');
        res.setHeader('Content-type', 'text/plain');
        res.charset = 'UTF-8';
        res.write(egreso);
        res.end();
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Ooops! El egreso no se ha podido generar', status: 500})
    }
}