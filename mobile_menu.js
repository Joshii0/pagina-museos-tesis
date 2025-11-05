// FUNCIONALIDAD DEL MENÚ MÓVIL
// Maneja la apertura y cierre del menú de navegación en dispositivos móviles

document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar el botón del menú móvil
  const mobileMenuButton = document.querySelector('.md\\:hidden.text-white');
  const mobileMenu = document.createElement('nav');
  mobileMenu.className = 'mobile-menu';

  // Detectar si estamos en MuseoCiudad o MuseoTorres
  const isMuseoTorres = window.location.pathname.includes('MuseoTorres');

  // Crear el menú móvil con los enlaces apropiados según el museo
  const menuLinks = isMuseoTorres ? `
    <a href="portal-museos.html">Turismo Jesús María</a>
    <a href="index.MuseoTorres.html">Inicio</a>
    <a href="historia.MuseoTorres.html">Historia</a>
    <a href="agenda.MuseoTorres.html">Agenda</a>
    <a href="contacto.MuseoTorres.html">Contacto</a>
    <a href="">EN</a>
  ` : `
    <a href="portal-museos.html">Turismo Jesús María</a>
    <a href="index.MuseoCiudad.html">Inicio</a>
    <a href="historia.MuseoCiudad.html">Historia</a>
    <a href="agenda.MuseoCiudad.html">Agenda</a>
    <a href="contacto.MuseoCiudad.html">Contacto</a>
    <a href="">EN</a>
  `;

  mobileMenu.innerHTML = menuLinks;

  // Insertar el menú móvil después del header
  const header = document.querySelector('header');
  header.appendChild(mobileMenu);

  // Toggle del menú móvil
  mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
  });

  // Cerrar menú al hacer click en un enlace
  mobileMenu.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      mobileMenu.classList.remove('active');
    }
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener('click', function(e) {
    if (!header.contains(e.target)) {
      mobileMenu.classList.remove('active');
    }
  });
});
