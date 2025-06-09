// Selector del contenedor principal
const moduloContenido = document.getElementById("modulo-contenido");

// Función para cargar el módulo desde un archivo JSON
function cargarModulo(numero) {
  fetch(`modules/modulo_${numero}_donante.json`)
    .then(response => response.json())
    .then(data => mostrarModulo(data))
    .catch(error => console.error("Error al cargar el módulo:", error));
}

// Función para mostrar el módulo
function mostrarModulo(data) {
  moduloContenido.innerHTML = ""; // Limpiar el contenido anterior

  // Título del módulo
  const h2 = document.createElement('h2');
  h2.textContent = data.modulo;
  moduloContenido.appendChild(h2);

  // Descripción del módulo
  const p = document.createElement('p');
  p.textContent = data.descripcion;
  moduloContenido.appendChild(p);

  // Crear formulario dinámico
  const form = document.createElement('form');

  data.campos.forEach(campo => {
    const label = document.createElement('label');
    label.textContent = campo.nombre + (campo.requerido ? ' *' : '');

    let input;

    if (campo.tipo === 'seleccion') {
      input = document.createElement('select');
      campo.opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion;
        option.textContent = opcion;
        input.appendChild(option);
      });
    } else if (campo.tipo === 'numerico') {
      input = document.createElement('input');
      input.type = 'number';
      input.placeholder = `Ej: ${campo.ejemplo || ''}`;
    }

    input.id = campo.nombre;
    input.required = campo.requerido || false;

    form.appendChild(label);
    form.appendChild(input);
  });

  // Botón para confirmar información
  const btnSubmit = document.createElement('button');
  btnSubmit.type = 'submit';
  btnSubmit.textContent = 'Confirmar Información';

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    validarFormulario(data.campos, moduloContenido);
  });

  moduloContenido.appendChild(form);
  moduloContenido.appendChild(btnSubmit);
}

// Función para validar el formulario
function validarFormulario(campos, container) {
  container.innerHTML = ""; // Limpiar mensajes anteriores

  let valid = true;

  campos.forEach(campo => {
    const valor = document.getElementById(campo.nombre).value;

    if (!valor && campo.requerido) {
      mostrarError(container, campo.nombre, campo.mensaje_error);
      valid = false;
    } else if (campo.rango && valor !== '') {
      const num = parseFloat(valor);
      if (num < campo.rango[0] || num > campo.rango[1]) {
        mostrarError(container, campo.nombre, campo.mensaje_error);
        valid = false;
      }
    }
  });

  if (valid) {
    const exito = document.createElement('div');
    exito.className = 'success';
    exito.textContent = '✅ Información confirmada correctamente.';
    container.appendChild(exito);
  }
}

// Función para mostrar errores
function mostrarError(container, campo, mensaje) {
  const error = document.createElement('div');
  error.className = 'error';
  error.textContent = `⚠️ ${campo}: ${mensaje}`;
  container.appendChild(error);
}

// Inicializar el módulo 1 al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarModulo(1);
});
