document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos
    const container = document.querySelector('.hero-container');
    const slidesWrapper = document.querySelector('.hero-slides-wrapper');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    // Variables para el arrastre
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let currentIndex = 0;
    let animationID = 0;
    
    // Inicializar
    slides.forEach((slide, index) => {
        // Eventos de arrastre del ratón
        slide.addEventListener('mousedown', dragStart);
        slide.addEventListener('mouseup', dragEnd);
        slide.addEventListener('mouseleave', dragEnd);
        slide.addEventListener('mousemove', drag);
        
        // Prevenir menú contextual al arrastrar
        slide.addEventListener('contextmenu', e => e.preventDefault());
    });
    
    // Agregar eventos a los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
    
    // Funciones de arrastre
    function dragStart(e) {
        e.preventDefault();
        startPos = e.clientX;
        isDragging = true;
        container.classList.add('grabbing');
        animationID = requestAnimationFrame(animation);
    }
    
    function drag(e) {
        if (isDragging) {
            const currentPosition = e.clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }
    
    function dragEnd() {
        isDragging = false;
        container.classList.remove('grabbing');
        cancelAnimationFrame(animationID);
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Si el arrastre fue lo suficientemente grande, cambia de slide
        if (movedBy < -100 && currentIndex < slides.length - 1) {
            currentIndex++;
        }
        
        if (movedBy > 100 && currentIndex > 0) {
            currentIndex--;
        }
        
        goToSlide(currentIndex);
    }
    
    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }
    
    function setSliderPosition() {
        slidesWrapper.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function goToSlide(index) {
        // Actualizar índice actual
        currentIndex = index;
        
        // Calcular nueva posición para centrar el slide
        currentTranslate = currentIndex * -window.innerWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
        
        // Actualizar dots
        dots.forEach((dot, idx) => {
            if (idx === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Ajustar slider cuando cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });
});