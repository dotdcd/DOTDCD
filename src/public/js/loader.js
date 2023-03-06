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
    imgLoader.className = 'loader';
    imgLoader.style.position = 'absolute';
    imgLoader.style.zIndex = '9999';
    imgLoader.style.opacity = '1';
  
    // Agregar la imagen al div creado
    divLoader.appendChild(imgLoader);
  
    // Agregar el div al cuerpo del documento
    document.body.appendChild(divLoader);
  }
  
  const form = document.querySelector('.form-group');
  
  form.addEventListener('submit', function(event) {
    mostrarLoader()
});