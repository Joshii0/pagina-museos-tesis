/* ARCHIVO PRINCIPAL DE JAVASCRIPT - Funcionalidades interactivas del sitio del Museo */
/* Este archivo maneja animaciones, navegación y efectos de usuario */

/* ========================================
   INICIALIZACIÓN DE LIBRERÍAS EXTERNAS
   ======================================== */

// FEATHER ICONS - Sistema de iconos vectoriales
// Reemplaza elementos <i data-feather="icon-name"> con SVG inline para mejor rendimiento
feather.replace();

// AOS ANIMATIONS - Biblioteca de animaciones al hacer scroll
// Configura animaciones que se activan cuando los elementos entran en el viewport
AOS.init({
  duration: 1000,  // Duración estándar de animaciones (1 segundo)
  once: true,      // Evita que las animaciones se repitan al volver a scrollear
});

/* ========================================
   FUNCIONALIDAD DEL BOTÓN "VOLVER ARRIBA"
   ======================================== */

// OBTIENE REFERENCIA AL BOTÓN - Busca el elemento por ID en el DOM
const scrollBtn = document.getElementById('scrollToTopBtn');

// VERIFICA EXISTENCIA DEL BOTÓN - Previene errores si el botón no está presente
if (scrollBtn) {
  // EVENTO DE SCROLL EN VENTANA - Monitorea la posición del scroll del usuario
  window.addEventListener('scroll', () => {
    // CONDICIÓN PARA MOSTRAR/OCULTAR - Aparece después de 300px de scroll
    if (window.scrollY > 300) {
      scrollBtn.classList.remove('hidden');  // Remueve clase 'hidden' para mostrar
    } else {
      scrollBtn.classList.add('hidden');     // Agrega clase 'hidden' para ocultar
    }
  });

  // EVENTO DE CLICK EN BOTÓN - Maneja el click para volver arriba
  scrollBtn.addEventListener('click', () => {
    // SCROLL SUAVE HACIA ARRIBA - Usa API moderna de scroll con comportamiento smooth
    window.scrollTo({
      top: 0,              // Posición superior (top de la página)
      behavior: 'smooth'   // Animación suave en lugar de salto instantáneo
    });
  });
}

/* ========================================
   FUNCIONALIDAD DEL FORMULARIO DE CONTACTO
   ======================================== */

// OBTIENE REFERENCIA AL FORMULARIO - Busca el formulario por ID
const formContacto = document.getElementById('form-contacto');
const mensajeContacto = document.getElementById('mensaje-contacto');

// VERIFICA EXISTENCIA DEL FORMULARIO - Previene errores si el formulario no está presente
if (formContacto) {
  // EVENTO DE SUBMIT DEL FORMULARIO - Maneja el envío del formulario
  formContacto.addEventListener('submit', async (e) => {
    e.preventDefault();  // Previene el envío por defecto del formulario

      // OBTIENE LOS DATOS DEL FORMULARIO
      const formData = new FormData(formContacto);
      const prefijo = formData.get('prefijo') || '+54';
      const telefono = formData.get('telefono');
      const telefonoCompleto = telefono ? `${prefijo} ${telefono}` : '';

      const data = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: telefonoCompleto,
        asunto: formData.get('asunto'),
        mensaje: formData.get('mensaje'),
        museo: 'MuseoCiudad'  // Identifica el museo
      };

    // VALIDA QUE TODOS LOS CAMPOS ESTÉN LLENOS
    if (!data.nombre || !data.email || !data.asunto || !data.mensaje) {
      mostrarMensaje('Por favor, complete todos los campos.', 'error');
      return;
    }

    // VALIDA FORMATO DE EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      mostrarMensaje('Por favor, ingrese un email válido.', 'error');
      return;
    }

    // VALIDA FORMATO DE TELÉFONO SI ESTÁ LLENO (ARGENTINA)
    if (data.telefono && !isValidPhone(data.telefono)) {
      mostrarMensaje('Por favor, ingrese un número de teléfono válido (ej: +54 9 3525 123456).', 'error');
      return;
    }

    try {
      // MUESTRA MENSAJE DE CARGA
      mostrarMensaje('Enviando mensaje...', 'info');

      // ENVÍA LOS DATOS AL SERVIDOR
      const response = await fetch('http://localhost:5000/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        // MENSAJE DE ÉXITO
        mostrarMensaje('¡Mensaje enviado correctamente! Gracias por contactarnos.', 'success');
        formContacto.reset();  // Limpia el formulario
      } else {
        // MENSAJE DE ERROR
        mostrarMensaje(result.message || 'Error al enviar el mensaje.', 'error');
      }
    } catch (error) {
      // ERROR DE CONEXIÓN
      mostrarMensaje('Error de conexión. Por favor, inténtelo más tarde.', 'error');
      console.error('Error:', error);
    }
  });
}

// FUNCIÓN PARA VALIDAR NÚMERO DE TELÉFONO ARGENTINO
function isValidPhone(phone) {
  // Limpia el teléfono de espacios, guiones y paréntesis
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Patrones para números argentinos:
  // +549XXXXXXXXX (internacional con 9)
  // +54XXXXXXXXX (internacional sin 9)
  // 549XXXXXXXXX (con 9)
  // 54XXXXXXXXX (sin 9)
  // 0XXXXXXXXX (local con 0)
  // XXXXXXXXX (local sin 0)

  const phoneRegex = /^(\+?549|0549|549|54|0)?[0-9]{8,10}$/;

  if (!phoneRegex.test(cleanPhone)) {
    return false;
  }

  // Verifica longitud mínima y máxima
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  const length = digitsOnly.length;

  // Para Argentina: mínimo 8 dígitos (local), máximo 13 (internacional con código de área)
  return length >= 8 && length <= 13;
}

// FUNCIÓN PARA MOSTRAR MENSAJES AL USUARIO
function mostrarMensaje(texto, tipo) {
  if (mensajeContacto) {
    // LIMPIA CLASES ANTERIORES
    mensajeContacto.className = 'mt-4 text-center text-sm font-semibold';

    // AGREGA CLASE SEGÚN EL TIPO DE MENSAJE
    if (tipo === 'success') {
      mensajeContacto.classList.add('text-green-600');
    } else if (tipo === 'error') {
      mensajeContacto.classList.add('text-red-600');
    } else if (tipo === 'info') {
      mensajeContacto.classList.add('text-blue-600');
    }

    // ESTABLECE EL TEXTO DEL MENSAJE
    mensajeContacto.textContent = texto;

    // OCULTA EL MENSAJE DESPUÉS DE 5 SEGUNDOS (EXCEPTO PARA INFO)
    if (tipo !== 'info') {
      setTimeout(() => {
        mensajeContacto.textContent = '';
      }, 5000);
    }
  }
}
