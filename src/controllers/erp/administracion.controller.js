import { pool } from '../../db.js'

//?marca
export const renderAdNuevo = async (req, res) => {
    res.render('administracion/marca/nuevo')
}

//? marca
export const renderAdBuscar = async (req, res) => {
    
    let marcasArray = [] //? <- crear array con let
    const marcas = await pool.query("SELECT marca_id, marca_descripcion FROM marcas") //? <- consultar a la base de datos
    marcas[0].forEach(m => {
        marcasArray.push([m.marca_id, m.marca_descripcion]) //? <- agregar a array
    });

    return res.render('administracion/marca/buscar', {marcasArray})
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
    res.render('administracion/clientes/buscar')
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
