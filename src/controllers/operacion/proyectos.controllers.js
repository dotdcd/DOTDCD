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
export const getProductoo = async (req, res) => {
  try {
    const searchText = req.query.searchText;
    const result = await pool.query(`SELECT productos.*, marcas.* FROM productos JOIN marcas ON productos.producto_marca_id = marcas.marca_id WHERE producto_descripcion LIKE '%${searchText}%' AND producto_estatus_baja = 0 LIMIT 15`);
    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}


const getMaxOrden = async () => {
  try {
    const result = await pool.query(`SELECT MAX(insumo_orden) AS max_orden FROM cotizaciones_insumos`);
    return result[0][0].max_orden;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
export const addServicio = async (req, res) => {
  const maxOrden = await getMaxOrden();
  try {
    const producto =  {
    producto_modelo: req.body.producto_modelo,
    producto_marca_id: req.body.producto_marca_id ,
    producto_unidad_id: req.body.producto_unidad_id ,
    producto_tipo_id: req.body.producto_tipo_id ,
    producto_familia_id: req.body.producto_familia_id ,
    producto_serie_id: req.body.producto_serie_id ,
    producto_costo: req.body.producto_costo ,
    producto_costo_fecha: req.body.producto_costo_fecha ,
    producto_mo: req.body.producto_mo ,
    producto_icampo:  req.body.producto_icampo ,
    producto_ioficina:  req.body.producto_ioficina ,
    producto_hm: req.body.producto_hm ,
    producto_financiero: req.body.producto_financiero ,
    producto_utilidad: req.body.producto_utilidad ,
    producto_descripcion: req.body.producto_descripcion ,
  };

    await pool.query("INSERT INTO productos SET ?", [producto]);

    const productoInsertado = await pool.query("SELECT * FROM `productos` WHERE producto_id = (SELECT MAX(producto_id) FROM productos)");
    
    
    const insumo = {
      insumo_cotizacion_id: req.body.insumo_cotizacion_id,
      insumo_cantidad: req.body.cantidad,
      insumo_producto_id: productoInsertado[0][0].producto_id,
      insumo_precio_mo: req.body.producto_precio_venta,
      insumo_orden: maxOrden + 1,
      tarjeta_ma_costo: "0",
      tarjeta_mo_jornadas: "0",
      tarjeta_mo_ayudante_salario: "0",
      tarjeta_mo_ayudante_jornadas: "0",
      tarjeta_mo_ingeniero_salario: "0",
      tarjeta_mo_ingeniero_jornadas: "0",
      tarjeta_mo_supervisor_salario: "0",
      tarjeta_mo_supervisor_jornadas: "0",
      tarjeta_hm_porcentaje: "0",
      tarjeta_icampo_porcentaje: "0",
      tarjeta_ioficina_porcentaje: "0",
      tarjeta_financiamiento_porcentaje: "0",
    }
    await pool.query("INSERT INTO cotizaciones_insumos SET ?", [insumo]);
    return res.status(200).json({ message: "Producto agregado correctamente" })
  } catch (error) {
    console.log(error);
    res.json({ message: "Error en la consulta, no se puede agregar el servicio" });
  }
}; 


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
      return res.redirect('back');

    }
  }

  export const updServicio = async (req, res) => {
    const maxOrden = await getMaxOrden();
    try {
      const producto =  {
        producto_codigo: req.body.producto_codigo,
        producto_modelo: req.body.producto_modelo,
        producto_marca_id: req.body.producto_marca_id ,
        producto_unidad_id: req.body.producto_unidad_id ,
        producto_tipo_id: req.body.producto_tipo_id ,
        producto_familia_id: req.body.producto_familia_id ,
        producto_serie_id: req.body.producto_serie_id ,
        producto_costo: req.body.producto_costo ,
        producto_costo_fecha: req.body.producto_costo_fecha ,
        producto_mo: req.body.producto_mo ,
        producto_icampo:  req.body.producto_icampo ,
        producto_ioficina:  req.body.producto_ioficina ,
        producto_hm: req.body.producto_hm ,
        producto_financiero: req.body.producto_financiero ,
        producto_utilidad: req.body.producto_utilidad ,
        producto_descripcion: req.body.producto_descripcion ,
    };
  
      await pool.query("UPDATE productos SET ? WHERE producto_id = ", [producto]);
  
      const productoInsertado = await pool.query("SELECT * FROM `productos` WHERE producto_id = (SELECT MAX(producto_id) FROM productos)");
      
      
      const insumo = {
        insumo_cotizacion_id: req.body.insumo_cotizacion_id,
        insumo_cantidad: req.body.cantidad,
        insumo_producto_id: productoInsertado[0][0].producto_id,
        insumo_precio_mo: req.body.producto_precio_venta,
        insumo_orden: maxOrden + 1,
        tarjeta_ma_costo: "0",
        tarjeta_mo_jornadas: "0",
        tarjeta_mo_ayudante_salario: "0",
        tarjeta_mo_ayudante_jornadas: "0",
        tarjeta_mo_ingeniero_salario: "0",
        tarjeta_mo_ingeniero_jornadas: "0",
        tarjeta_mo_supervisor_salario: "0",
        tarjeta_mo_supervisor_jornadas: "0",
        tarjeta_hm_porcentaje: "0",
        tarjeta_icampo_porcentaje: "0",
        tarjeta_ioficina_porcentaje: "0",
        tarjeta_financiamiento_porcentaje: "0",
      }

      await pool.query("INSERT INTO cotizaciones_insumos SET ?", [insumo]);
      return res.status(200).json({ message: "Producto agregado correctamente" })
    } catch (error) {
      console.log(error);
      res.json({ message: "Error en la consulta, no se puede agregar el servicio" });
    }
  };

  //? add producto

  export const addProducto = async (req, res) => {
    try {
      const maxOrden = await getMaxOrden();
        
      const insumo = {
        insumo_cotizacion_id: req.body.cotizacion_id,
        insumo_cantidad: req.body.cantidad,
        insumo_producto_id: req.body.producto,
        insumo_diciplina_id: req.body.disciplina_id,
        insumo_precio_mo: req.body.mo,
        insumo_orden: maxOrden + 1,
        insumo_precio_ma: req.body.ma,
        tarjeta_mo_jornadas: req.body.tarjeta_producto_mo,
        tarjeta_hm_porcentaje: req.body.tarjeta_producto_hm,
        tarjeta_icampo_porcentaje: req.body.tarjeta_producto_icampo,
        tarjeta_ioficina_porcentaje: req.body.tarjeta_producto_ioficina,
        tarjeta_financiamiento_porcentaje: req.body.tarjeta_producto_financiero
      }

      const tarjeta = {
        tarjeta_cotizacion_id: req.body.cotizacion_id,
        tarjeta_mo_jornadas: req.body.tarjeta_producto_mo,
        tarjeta_hm_porcentaje: req.body.tarjeta_producto_hm,
        tarjeta_icampo_porcentaje: req.body.tarjeta_producto_icampo,
        tarjeta_ioficina_porcentaje: req.body.tarjeta_producto_ioficina,
        tarjeta_financiamiento_porcentaje: req.body.tarjeta_producto_financiero
      }

      await pool.query("INSERT INTO cotizaciones_insumos SET ?", [insumo])
      await pool.query("INSERT INTO cotizaciones_tarjetas SET ?", [tarjeta])

      return res.status(200).json({ message: "Producto agregado correctamente" })
    } catch (error) {
      console.log(error)
      return res.json({ message: "Error en la consulta, no se puede agregar el servicio" });
    }
  }
 
  //! delete insumo
  //* Falta traer el params desde el front porque no lo reconoce
  export const deleteInsumo = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
      await pool.query('DELETE FROM cotizaciones_insumos WHERE insumo_orden = ?', [id]);
      req.flash('success', { title: 'Insumo eliminado', message: 'El insumo se ha eliminado correctamente' });
     // res.render('/dashboard/operacion/proyectos/buscar')
    } catch (error) {
      console.log(error);
      req.flash('error', { title: 'Ooops!', message: 'Error al eliminar el insumo' });
      //res.render('/dashboard/operacion/proyectos/buscar')
    }
  };


  //? prefactura
  const getIdPre = async () => {
    try {
      const id = await pool.query('SELECT * FROM prefacturas ORDER BY prefactura_id DESC LIMIT 1')
    

      return id[0][0].prefactura_id
    } catch (error) {
      console.log(error)
    }
  }

  export const addPrefacturaOP = async (req, res) => {
    try {
      const {proyectos} = req.body
      await pool.query('INSERT INTO prefacturas SET ?', {descripcion: 'prefactura test'})
      const id = await getIdPre()
      for (const p of proyectos) {
        await pool.query('INSERT INTO prefacturas_proyectos SET ?', {prefactura_id: id, cotizacion_id: p})
      }
      req.flash('success', {title: 'Prefactura creada', message: 'La prefactura se ha creado correctamente'})
      return res.redirect('/dashboard/operacion/proyectos/buscar')
    } catch (error) {
      console.log(error)
    }
  }
  
