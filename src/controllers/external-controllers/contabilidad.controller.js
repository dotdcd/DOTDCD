
const delEmpresa = async(id) => {
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
                await axios.delete('/delEmpresa/' + id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'La empresa ha sido eliminada correctamente.',
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


const delInversion = async(id) => {
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
                await axios.delete('/delInversion/' + id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'La inversion ha sido eliminada correctamente.',
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

const delCuenta = async(id) => {
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
                await axios.delete('/delCuenta/' + id)
                    .then(function (response) {
                        swal.fire(
                            'Eliminado!',
                            'La cuenta ha sido eliminada correctamente.',
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