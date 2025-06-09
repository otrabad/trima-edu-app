const modulos = {
  1: 'modules/modulo_1_donante.json'
};

function cargarModulo(numero) {
  fetch(modulos[numero])
    .then(response => response.json())
    .then(data => mostrarModulo(data));
}

function mostrarModulo(data) {
  const container = document.getElementById("modulo-contenido");
  container.innerHTML = "";

  // Título y descripción
  const h2 = document.createElement('h2');
  h2.textContent = data.modulo;
  container.appendChild(h2);

  const p = document.createElement('p');
  p.textContent = data.descripcion;
  container.appendChild(p);

  // Generar formulario dinámico
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

  const divMensajes = document.createElement('div');
  divMensajes.id = 'mensajes';

  const btnSubmit = document.createElement('button');
  btnSubmit.type = 'submit';
  btnSubmit.textContent = 'Confirmar Información';

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    validarFormulario(data.campos, divMensajes);
  });

  form.appendChild(divMensajes);
  form.appendChild(btnSubmit);

  container.appendChild(form);
}

function validarFormulario(campos, mensajesDiv) {
  mensajesDiv.innerHTML = '';
  let valid = true;

  campos.forEach(campo => {
    const valor = document.getElementById(campo.nombre).value;
    if (!valor && campo.requerido) {
      mostrarError(mensajesDiv, campo.nombre, 'Campo requerido.');
      valid = false;
    } else if (campo.rango && valor !== '') {
      const num = parseFloat(valor);
      if (num < campo.rango[0] || num > campo.rango[1]) {
        mostrarError(mensajesDiv, campo.nombre, campo.mensaje_error || `Fuera de rango (${campo.rango[0]}–${campo.rango[1]}).`);
        valid = false;
      }
    }
  });

  if (valid) {
    const exito = document.createElement('div');
    exito.className = 'success';
    exito.textContent = '✅ Información confirmada correctamente.';
    mensajesDiv.appendChild(exito);
  }
}

function mostrarError(container, campo, mensaje) {
  const error = document.createElement('div');
  error.className = 'error';
  error.textContent = `⚠️ ${campo}: ${mensaje}`;
  container.appendChild(error);
}
