/* ARCHIVO PRINCIPAL DE JAVASCRIPT - Funcionalidades interactivas del sitio */
/* Este archivo maneja formularios, carrusel, calendario y efectos de navegación */

AOS.init({
  duration: 800,          // Duración de las animaciones en milisegundos
  easing: 'ease-in-out',  // Tipo de transición suave
  once: true              // Las animaciones solo se ejecutan una vez
});
feather.replace();  // Inicializa los iconos de Feather

  /* ========================================
     CARRUSEL UNIVERSAL (index, index-en, etc.)
     ======================================== */
  const carousel = document.querySelector('.carousel');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentIndex = 0;      // Índice de la imagen actual
  let autoInterval;          // Intervalo para avance automático

  // ACTUALIZA EL CARRUSEL - Cambia la posición y estilos de los indicadores
  function updateCarousel() {
    if (!carousel || items.length === 0) return;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle('bg-gray-800', idx === currentIndex);
      dot.classList.toggle('bg-gray-300', idx !== currentIndex);
      dot.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
    });
  }

  // VA A UNA DIAPOSITIVA ESPECÍFICA
  function goToSlide(idx) {
    currentIndex = idx;
    updateCarousel();
    resetAutoAdvance();
  }

  // AVANZA A LA SIGUIENTE DIAPOSITIVA
  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
    resetAutoAdvance();
  }

  // RETROCEDE A LA DIAPOSITIVA ANTERIOR
  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
    resetAutoAdvance();
  }

  // REINICIA EL AVANCE AUTOMÁTICO
  function resetAutoAdvance() {
    clearInterval(autoInterval);
    autoInterval = setInterval(nextSlide, 5000);  // Avanza cada 5 segundos
  }

  // INICIALIZA EL CARRUSEL SI EXISTE
  if (carousel && items.length > 0) {
    updateCarousel();
    resetAutoAdvance();

    // Agrega event listeners a los botones de navegación
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Agrega event listeners a los indicadores (dots)
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx));
    });
  }

  /* ========================================
     BOTÓN SCROLL TO TOP
     ======================================== */
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (scrollBtn) {
    // Muestra/oculta el botón según la posición del scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.remove('hidden');  // Muestra el botón
      } else {
        scrollBtn.classList.add('hidden');     // Oculta el botón
      }
    });

    // Scroll suave hacia arriba al hacer clic
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        museo: 'MuseoTorres'  // Identifica el museo
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
