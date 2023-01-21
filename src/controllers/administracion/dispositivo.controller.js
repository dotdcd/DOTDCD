import { pool } from '../../db.js'


export const addDispositivo = async (req, res) => {
    try {
        await pool.query('INSERT INTO dispositivo set ?', [req.body])
        req.flash('success', { title: 'Dispositivo agregado', message: 'El dispositivo se ha agregado correctamente' })
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    }
    catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El dispositivo ya existe' })
        return res.redirect('/dashboard/administracion/dispositivos/nuevo')
    }

}

export const getDispositivo = async (req, res) => {
    try {
        const dispositivo = await pool.query('SELECT c.componente_id, componente_nombre, CASE WHEN dispositivo_id > 0 THEN 1 ELSE 0 END as activo, ifnull(pc.rendimiento_hr, 0) as rendimiento_hr, ifnull(pc.rendimiento_min, 0) as rendimiento_min, ifnull(NULLIF(pc.costo, ""), 0) as costo FROM componentes c LEFT JOIN dispositivo_componentes pc ON pc.componente_id = c.componente_id AND pc.dispositivo_id = 22 WHERE c.activo = 1 order by componente_id')
        var dispo = dispositivo[0]
        console.log(dispo)
    }
    catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El dispositivo no se pudo encontrar' })
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    }
}


export const updDispositivo1 = async (req, res) => {
    try {
        console.log(req.body)
        console.log('si llego')
        await pool.query('UPDATE dispositivo set ? WHERE dispositivo_id = ?', [req.body, req.params.id])

        req.flash('success', { title: 'Dispositivo actualizado', message: 'El dispositivo se ha actualizado correctamente' })
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El dispositivo no se pudo modificar' })
        return res.redirect('/dashboard/administracion/dispositivos/editar/' + req.params.id)
    }
}


export const updDispositivo2 = async (req, res) => {
    try {
        await pool.query('DELETE FROM dispositivo_componentes WHERE dispositivo_id =' + req.params.id)
        const data = req.body;
        for (let i = 0; i < data.length; i++) {
            if (data[i].rendimiento_hr !== '0' && data[i].rendimiento_min !== '0' && data[i].costo !== '0') {
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            else if(data[i].rendimiento_hr !== '0' && data[i].rendimiento_min !== '0'){
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            else if(data[i].rendimiento_hr !== '0'){
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            else if(data[i].rendimiento_min !== '0' && data[i].costo !== '0'){
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            else if(data[i].costo !== '0'){
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            
        }
        
        req.flash('success', { title: 'Exito!', message: 'Los datos se guardaron correctamente' })
        return res.redirect('/dashboard/administracion/dispositivos/editar/' + req.params.id);

    } catch (error) {
        console.log(error);
    }
}

export const addDispositivoComponente = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            if (data[i].rendimiento_hr !== '0' && data[i].rendimiento_min !== '0' && data[i].costo !== '0') {
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            else if(data[i].rendimiento_hr !== '0' && data[i].rendimiento_min !== '0'){
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            else if(data[i].rendimiento_hr !== '0'){
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            else if(data[i].rendimiento_min !== '0' && data[i].costo !== '0'){
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            else if(data[i].costo !== '0'){
                await pool.query('INSERT INTO dispositivo_componentes SET ?', data[i]);
            }
            
        }
        
        req.flash('success', { title: 'Exito!', message: 'Los datos se guardaron correctamente' })
        return res.redirect('/dashboard/administracion/dispositivos/buscar');

    } catch (error) {
        console.log(error);
    }
}

export const delDispositivo = async (req, res) => {
    try {
        await pool.query('UPDATE dispositivo set dispositivo_estatus_baja = 1 WHERE dispositivo_id = ?', [req.params.id])
        req.flash('success', { title: 'Dispositivo eliminado', message: 'El dispositivo se ha eliminado correctamente' })
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'El dispositivo no se pudo eliminar' })
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    }
}

