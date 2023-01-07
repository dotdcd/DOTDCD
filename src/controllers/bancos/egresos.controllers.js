import {pool} from '../../db.js'
import fs from 'fs-extra'

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

export const genTxt = async (req, res) => {
    try {
        const egreso = {
            uuid: '1a237505-85ec-4485-830e-d0fa08ed02c7',
            folio: 'F-FLO2291101',
            fecha: '20221226',
            cargo1: '9367.80',
            cargo2: '1461.55',
            abono: '10829.35',
            concepto: 'SERVICIOS GASOLINEROS DE MEXICO',
            nPoliza: '4312',
            cuenta1: '60148000',
            cuenta2: '11801000',
            cuenta3: '10201004',
        }
        fs.writeFile('src/uploads/egresos.txt', `P  ${egreso.fecha}    2      ${egreso.nPoliza} 1 0          ${egreso.concepto}                                                                      12 1 0  \nM1 ${egreso.cuenta1}                       ${egreso.folio}                   0  ${egreso.cargo1}             0          0.0                  ${egreso.concepto}                                                                            		\nAM ${egreso.uuid}	\nM1 ${egreso.cuenta2}                       ${egreso.folio}                   0  ${egreso.cargo2}             0          0.0                  ${egreso.concepto}                                                                            		\nAM ${egreso.uuid}	\nM1 ${egreso.cuenta3}                       ${egreso.folio}                   1  ${egreso.abono}            0          0.0                  ${egreso.concepto}                                                                            		\nAM ${egreso.uuid}	\nAD ${egreso.uuid}	`, (err) => {console.log(err)})
        return res.status(200).json({message: 'Egreso generado', status: 200})  
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Ooops! El egreso no se ha podido generar', status: 500})
    }
}