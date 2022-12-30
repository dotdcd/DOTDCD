//!Eliminar disciplina
const delRequisicion = async(id) => {
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
                await axios.delete('/delRequisicion/' + id)
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

//!Eliminar proyecto
const delProyecto = async(id) => {
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
                await axios.post('/delProyecto/' + id)
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
  
  
  
//!eliminar basura
const delBasura = async(id) => {
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
                await axios.delete('/delBasura/' + id)
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