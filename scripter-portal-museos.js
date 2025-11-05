// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Initialize Feather Icons
feather.replace();

// Header scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');

    // Add scroll event listener
    window.addEventListener('scroll', toggleHeader);

    // Initial check
    toggleHeader();

    console.log('Header scroll functionality initialized');

    // Simple carousel functionality
    const carousels = document.querySelectorAll('.overflow-x-auto');
    carousels.forEach(carousel => {
        let isDown = false;
        let startX;
        let scrollLeft;
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener('mouseleave', () => {
            isDown = false;
        });
        carousel.addEventListener('mouseup', () => {
            isDown = false;
        });
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    });

    // Smooth scroll functionality for scroll-to-section button
    const scrollButton = document.querySelector('.scroll-to-section');
    if (scrollButton) {
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.getElementById('main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                console.log('Smooth scroll to section:', targetId);
            }
        });
    }

    // Scroll to top button functionality
    const scrollToTopButton = document.getElementById('scroll-to-top');
    if (scrollToTopButton) {
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopButton.classList.remove('opacity-0', 'pointer-events-none');
                scrollToTopButton.classList.add('opacity-100');
            } else {
                scrollToTopButton.classList.remove('opacity-100');
                scrollToTopButton.classList.add('opacity-0', 'pointer-events-none');
            }
        });

        // Scroll to top when button is clicked
        scrollToTopButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Scroll to top triggered');
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


});
