//!Eliminar cliente
const delCliente = async(id) => {
    try {
        swal.fire({
            title: '¿Estas seguro?',
            text: "Esta acción no se puede deshacer! \n ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('/delCliente/' + id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'El cliente ha sido eliminado correctamente.',
                            'success'
                        )
                        location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    } catch (e) {
        return e
    }
}


//!Eliminar disciplina
const delDisciplina = async(id) => {
    try {
        swal.fire({
            title: '¿Estas seguro?',
            text: "Esta acción no se puede deshacer! \n ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('/delDisciplina/' + id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'La disciplina ha sido eliminada correctamente.',
                            'success'
                        )
                        location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    } catch (e) {
        console.log(e)
    }
}


//!Eliminar proveedores
const delProveedor = async(id) => {
    try {
        swal.fire({
            title: '¿Estas seguro?',
            text: "Esta acción no se puede deshacer! \n ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('/delProveedor/' + id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'El proveedor ha sido eliminado correctamente.',
                            'success'
                        )
                        location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    } catch (e) {
        console.log(e)
    }
}


//! eliminar cables
const delCable = async(id) => {
    try {
        swal.fire({
            title: '¿Estas seguro?',
            text: "Esta acción no se puede deshacer! \n ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('/delCables/' + id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'El cable ha sido eliminado correctamente.',
                            'success'
                        )
                        location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    } catch (e) {
       console.log(e)
    }
}

const delMarca = async(id) => {
    try {
        swal.fire({
            title: '¿Estas seguro?',
            text: "Esta acción no se puede deshacer! \n ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('/delMarca/' + id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'La marca ha sido eliminada correctamente.',
                            'success'
                        )
                        location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    } catch (e) {
        console.log(e)
    }
}

const delprovMarca = async(id) => {
    try {
        swal.fire({
            title: '¿Estas seguro?',
            text: "Esta acción no se puede deshacer! \n ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('/delPMarca/'+id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'El proveedor por marca ha sido eliminado correctamente.',
                            'success'
                        )
                        location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    } catch (e) {
        console.log(e)
    }
}

const delProductos = async(id) => {
    try {
        swal.fire({
            title: '¿Estas seguro?',
            text: "Esta acción no se puede deshacer! \n ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('/delProducto/'+id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'El producto ha sido eliminado correctamente.',
                            'success'
                        )
                        location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
    } catch (e) {
        console.log(e)
    }
}