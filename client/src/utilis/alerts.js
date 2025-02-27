import Swal from 'sweetalert2';

// Función para mostrar alerta de éxito
export const alertSuccess = (message) => {
  console.log('Mostrando alerta de éxito:', message);

  Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: message,
  });
};

// Función para mostrar alerta de error
export const alertError = (message) => {
  console.log('Mostrando alerta de error:', message);

  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
  });
};



export const alertConfirm = (message) => {
  return new Promise((resolve) => {
    Swal.fire({
      title: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      resolve(result.isConfirmed);
    });
  });
};
