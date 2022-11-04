import { pool } from '../../db.js'

//?marca
export const renderAdNuevo = async (req, res) => {
    res.render('administracion/marca/nuevo')
}

//? marca
export const renderAdBuscar = async (req, res) => {
    try {
        let marcasArray = [] //? <- crear array con let
        const marcas = await pool.query("SELECT marca_id, marca_descripcion, marca_estatus_baja as marca_status FROM marcas") //? <- consultar a la base de datos
        marcas[0].forEach(m => {
            const status = m.marca_status == 0 ? "<span class='badge badge-success badge-pill'>Activo</span>" : "<span class='badge badge-danger badge-pill' >Inactivo</span>"
            marcasArray.push([m.marca_id, m.marca_descripcion, status, '<center><button type="button" class="btn btn-lg btn-outline-success mr-5" onClick="showModalPut({id: '+m.marca_id+', marca_descripcion: '+"'"+m.marca_descripcion+"'"+', marca_estatus: '+m.marca_status+'})"><i class="fal fa-sync"></i></button>  <button type="button" class="btn btn-lg btn-outline-danger" onClick="showModalDel('+m.marca_id+')"><i class="fal fa-trash-alt"></i></button></center>']) //? <- agregar a array
        });
    
        return res.render('administracion/marca/buscar', {marcasArray}) //? <- renderizar vista
    } catch (error) {
        console.log(error)
    }
}

export const renderAdProvMarca = async (req, res) => {

    let provArray = []
    const prov = await  pool.query('SELECT m.marca_descripcion as marca, p.proveedor_razon_social as proveedor, p.proveedor_estatus_baja as estatus FROM marcas_proveedores mp INNER JOIN marcas m ON m.marca_id = mp.proveedoresxmarca_marca_id INNER JOIN proveedores p ON p.proveedor_id = mp.proveedoresxmarca_marca_id')
    prov[0].forEach(p => {
        const status = (p.prov_status == 1) ? 'Inactivo' : 'Activo'
        provArray.push([p.marca, p.proveedor, status])
    });
    res.render('administracion/marca/prov_marca', {provArray})
}

//?clientes
export const renderCliNuevo = async (req, res) => {

    res.render('administracion/clientes/nuevo')
}

export const renderCliBuscar = async (req, res) => {
    let cliArray = []
    const cli = await pool.query("SELECT IF(cliente_razon_social = '', 'SIN AGREGAR', cliente_razon_social) as rsocial, IF(cliente_rfc = '', 'SIN AGREGAR', cliente_rfc) as rfc, IF(cliente_calle = '', 'SIN AGREGAR' , cliente_calle) as calle, IF(cliente_colonia = '', 'SIN AGREGAR', cliente_colonia) as colonia, IF(cliente_municipio = '', 'SIN AGREGAR', cliente_municipio) as municipio, IF(cliente_estado = '', 'SIN AGREGAR', cliente_estado) as estado, IF(cliente_codigo_postal = 0, 'pendiente', cliente_codigo_postal) as cp, IF(cliente_telefono = '', 'SIN AGREGAR', cliente_telefono) as telefono, IF(cliente_contacto = '', 'SIN AGREGAR', cliente_contacto) as contacto, IF(cliente_cobranza = '', 'SIN AGREGAR', cliente_cobranza) as cobranza, IF(cliente_estatus_baja = NULL, 'SIN AGREGAR', cliente_estatus_baja) as estatus FROM clientes")
    cli[0].forEach(c => {
        const cstatus = (c.status == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
        cliArray.push([c.rsocial, c.rfc, c.calle, c.colonia, c.municipio, c.estado, c.cp, c.telefono, c.contacto, c.cobranza, cstatus])
    });

    res.render('administracion/clientes/buscar', {cliArray})
}

//?proveedores
export const renderPBNuevo = async (req, res) => {
    res.render('administracion/proveedores/nuevo')
}

export const renderPBBuscar = async (req, res) => {
    res.render('administracion/proveedores/buscar')
}


export const renderDCNuevo = async (req, res) => {
    res.render('administracion/disciplina/nueva')
}

export const renderDCBuscar = async (req, res) => {
    res.render('administracion/disciplina/buscar')
}
