

const addContract = async (id) => {
    try {
        const form = document.querySelector("#form" + id);
        const data = {
            id: id,
            periodo: form.periodo.value,
            sueldo: form.sueldo.value,
            inicio: form.inicio.value,
            vencimiento: form.vencimiento.value,
        }
        await axios.post('/addContract', data)
            .then(function (response) {
                console.log(response);
                Swal.fire(
                    'Contrato registrado!',
                    'Se envio una notificación al empleado para firmar el contrato. \n Asegurate de que el empleado firme el contrato en las proximas 24 horas.',
                    'success'
                )
            })
    } catch (error) {
        console.log(error)
    }
}

const aceptContract = async (id, status) => {
    const data = {
        id: id,
        status: status
    }
    console.log(id, status)
    await axios.put('/aceptContract', data)
        .then(function (response) {
            if (response.status != 200) {
                Swal.fire(
                    'Oops...!',
                    'No tienes un contrato que firmar, inenta ponerte en contacto con el área de recursos humanos para una aclaración',
                    'error'
                )
            }
            Swal.fire({
                title: 'Contrato Aceptado',
                text: "El contrato se ha reconocido correctamente",
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    window.location.href = '/dashboard/contabilidad/empleados/ver/contratos';
                }
            })
        })
        .catch(function (error) {
            Swal.fire(
                'Oops...!',
                'Algo salio mal!, Intente de nuevo',
                'error'
            )
        });
};

const declibeContract = async (id, status) => {
    const data = {
        id: id,
        status: status
    }
    await axios.put('/declibeContract', data)
        .then(function (response) {
            if (response.status != 200) {
                Swal.fire(
                    'Oops...!',
                    'No tienes un contrato que firmar, inenta ponerte en contacto con el área de recursos humanos para una aclaración',
                    'error'
                )
            }
            Swal.fire({
                title: 'Contrato Rechazado',
                text: "El contrato se ha rechazado y se ha enviado una notificación al empleado",
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    window.location.href = '/dashboard/contabilidad/empleados/ver/contratos';
                }
            })
        })
        .catch(function (error) {
            Swal.fire(
                'Oops...!',
                'Algo salio mal!, Intente de nuevo',
                'error'
            )
        });
};

const dltTestify = async (id) => {
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
            await axios.delete('/dltTestify/' + id)
                .then(function (response) {
                    swal.fire(
                        'Eliminado!',
                        'El testimonio ha sido eliminado correctamente.',
                        'success'
                    )
                    location.reload();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    })
};

