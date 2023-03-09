//? Loader para forms
function mostrarLoader() {
  // Crear el elemento div que ocupará toda la pantalla
  const divLoader = document.createElement('div');
  divLoader.style.position = 'fixed';
  divLoader.style.top = '0';
  divLoader.style.left = '0';
  divLoader.style.width = '110vw';
  divLoader.style.height = '100vh';
  divLoader.style.backgroundColor = 'black';
  divLoader.style.opacity = '0.7';

  // Crear el elemento img con la imagen a mostrar
  const imgLoader = document.createElement('span');
  imgLoader.className = 'formloader';
  imgLoader.style.left = '50%';
  imgLoader.style.top = '50%';
  imgLoader.style.transform = 'translate(-50%, -50%)';
  imgLoader.style.position = 'absolute';
  imgLoader.style.zIndex = '9999';
  imgLoader.style.opacity = '1';

  // Agregar la imagen al div creado
  divLoader.appendChild(imgLoader);

  // Agregar el div al cuerpo del documento
  document.body.appendChild(divLoader);
}

const form = document.querySelector('.form-group');

form.addEventListener('submit', function (event) {
  mostrarLoader()
});

//? Loader para eliminar
function loaderDelete() {
  const divLoader = document.createElement('div');
  divLoader.style.position = 'fixed';
  divLoader.style.top = '0';
  divLoader.style.left = '0';
  divLoader.style.width = '110vw';
  divLoader.style.height = '100vh';
  divLoader.style.backgroundColor = 'black';
  divLoader.style.opacity = '0.7';

  // Crear el elemento img con la imagen a mostrar
  const imgLoader = document.createElement('span');
  imgLoader.className = 'loaderDelete';
  imgLoader.style.left = '50%';
  imgLoader.style.top = '50%';
  imgLoader.style.transform = 'translate(-50%, -50%)';
  imgLoader.style.position = 'absolute';
  imgLoader.style.zIndex = '9999';
  imgLoader.style.opacity = '1';


  // Agregar la imagen al div creado
  divLoader.appendChild(imgLoader);
  const textLoader = document.createTextNode('Eliminar');
  imgLoader.appendChild(textLoader);

  // Agregar el div al cuerpo del documento
  document.body.appendChild(divLoader);
}

//? Loader para agregar
function loaderUp() {
  const divLoader = document.createElement('div');
  divLoader.style.position = 'fixed';
  divLoader.style.top = '0';
  divLoader.style.left = '0';
  divLoader.style.width = '110vw';
  divLoader.style.height = '100vh';
  divLoader.style.backgroundColor = 'black';
  divLoader.style.opacity = '0.7';

  // Crear el elemento img con la imagen a mostrar
  const imgLoader = document.createElement('span');
  imgLoader.className = 'loaderUp';
  imgLoader.style.left = '50%';
  imgLoader.style.top = '50%';
  imgLoader.style.transform = 'translate(-50%, -50%)';
  imgLoader.style.position = 'absolute';
  imgLoader.style.zIndex = '9999';
  imgLoader.style.opacity = '1';


  // Agregar la imagen al div creado
  divLoader.appendChild(imgLoader);

  // Agregar el div al cuerpo del documento
  document.body.appendChild(divLoader);
}

//? Loader para editar
function loaderUpd() {
  const divLoader = document.createElement('div');
  divLoader.style.position = 'fixed';
  divLoader.style.top = '0';
  divLoader.style.left = '0';
  divLoader.style.width = '110vw';
  divLoader.style.height = '100vh';
  divLoader.style.backgroundColor = 'black';
  divLoader.style.opacity = '0.7';

  // Crear el elemento img con la imagen a mostrar
  const imgLoader = document.createElement('span');
  imgLoader.className = 'loaderUpd';
  imgLoader.style.left = '50%';
  imgLoader.style.top = '50%';
  imgLoader.style.transform = 'translate(-50%, -50%)';
  imgLoader.style.position = 'absolute';
  imgLoader.style.zIndex = '9999';
  imgLoader.style.opacity = '1';


  // Agregar la imagen al div creado
  divLoader.appendChild(imgLoader);

  // Agregar el div al cuerpo del documento
  document.body.appendChild(divLoader);
}